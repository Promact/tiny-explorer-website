import { type Loader, type LoaderContext } from "astro/loaders";

interface StrapiLoaderOptions {
  contentType: string;
  url?: string;
  token?: string;
  queryParams?: Record<string, string | number | boolean>;
  isSingleType?: boolean;
}

export function strapiLoader({
  contentType,
  url,
  token,
  queryParams = {},
  isSingleType = false,
}: StrapiLoaderOptions): Loader {
  return {
    name: "strapi-loader",
    load: async (context: LoaderContext) => {
      const strapiUrl =
        url || import.meta.env.STRAPI_URL || "http://localhost:1337";
      const strapiToken = token || import.meta.env.STRAPI_TOKEN;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (strapiToken) {
        headers["Authorization"] = `Bearer ${strapiToken}`;
      }

      context.logger.info(`Fetching ${contentType} from Strapi...`);

      const allEntries = [];
      let page = 1;
      let pageCount = 1;

      // Construct query string from params
      // Construct query string manually to avoid URLSearchParams encoding brackets
      const queryParts: string[] = [];
      const appendParams = (params: any, prefix = "") => {
        Object.entries(params).forEach(([key, value]) => {
          const newKey = prefix ? `${prefix}[${key}]` : key;
          if (typeof value === "object" && value !== null) {
            appendParams(value, newKey);
          } else {
            queryParts.push(`${newKey}=${value}`);
          }
        });
      };

      appendParams(queryParams);

      try {
        do {
          let queryString = queryParts.join("&");

          if (!isSingleType) {
            const pagination = `pagination[page]=${page}&pagination[pageSize]=100`;
            queryString = queryString ? `${queryString}&${pagination}` : pagination;
          }

          const endpoint = `${strapiUrl}/api/${contentType}?${queryString}`;
          context.logger.info(`Fetching from URL: ${endpoint}`);
          context.logger.info(`Fetching from URL: ${endpoint}`);

          const response = await fetch(endpoint, { headers });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch from Strapi: ${response.statusText}`
            );
          }

          const data = await response.json();

          // Handle v5 structure where single types might be direct object or data.data is object
          let entries = [];
          if (Array.isArray(data.data)) {
            entries = data.data;
          } else if (data.data && typeof data.data === "object") {
            entries = [data.data];
            // Single type has no pagination, so force exit loop after this
            pageCount = 0;
          } else if (Array.isArray(data)) {
            entries = data; // v4 sometimes or custom
          } else {
            // Fallback/Warning but try to handle as single if object
            if (typeof data === "object") {
              entries = [data];
              pageCount = 0;
            } else {
              context.logger.warn(
                `Unexpected data structure for ${contentType}`
              );
            }
          }

          const meta = data.meta || {};

          allEntries.push(...entries);

          if (meta.pagination) {
            pageCount = meta.pagination.pageCount;
          } else if (pageCount !== 0) {
            // If no pagination meta and we haven't forced it to 0 (single type), assume single page
            pageCount = isSingleType ? 0 : 1;
          }

          page++;
        } while (page <= pageCount);

        context.logger.info(
          `Loaded ${allEntries.length} entries for ${contentType}`
        );

        allEntries.forEach((entry: any) => {
          // Flatten attributes if they exist (Strapi v4)
          // Strapi v5 might be different, but assuming standard v4 response structure for now:
          // { id: 1, attributes: { ... } }
          // If the API returns flattened structure (e.g. using a plugin or v5), adjust accordingly.

          // Try to handle both structure with 'attributes' and without
          const data = entry.attributes
            ? { ...entry.attributes }
            : { ...entry };

          // Ensure we have an ID
          const id =
            entry.id?.toString() || entry.documentId?.toString() || data.slug;

          if (!id) {
            context.logger.warn(
              `Entry for ${contentType} missing ID, skipping.`
            );
            return;
          }

          // Add Strapi specific metadata
          data.strapiId = entry.id;
          if (entry.documentId) data.documentId = entry.documentId;

          context.store.set({
            id,
            data,
          });
        });
      } catch (error) {
        context.logger.error(
          `Error loading ${contentType}: ${(error as Error).message}`
        );
        throw error;
      }
    },
  };
}
