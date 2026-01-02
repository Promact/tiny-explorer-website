import { HttpTypes } from "@medusajs/types";
import { medusa } from "../medusa";
import medusaError from "../util/medusa-error";

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export const listRegions = async () => {
  return medusa.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
    })
    .then(({ regions }) => regions)
    .catch(medusaError);
};

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode);
    }

    const regions = await listRegions();

    if (!regions) {
      return null;
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region);
      });
    });

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us");

    return region;
  } catch {
    return null;
  }
};
