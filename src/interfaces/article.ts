export interface StrapiMedia {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		thumbnail: StrapiMediaFormat;
		small?: StrapiMediaFormat;
		medium?: StrapiMediaFormat;
		large?: StrapiMediaFormat;
	};
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	createdAt: string;
	updatedAt: string;
}

export interface StrapiMediaFormat {
	name: string;
	hash: string;
	ext: string;
	mime: string;
	path: string | null;
	width: number;
	height: number;
	size: number;
	url: string;
}

export interface Author {
	id: number;
	documentId: string;
	name: string;
	email: string;
	avatar?: StrapiMedia;
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
}

export interface Category {
	id: number;
	documentId: string;
	name: string;
	slug: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
}

export interface ComponentSharedMedia {
	__component: "shared.media";
	id: number;
	file: StrapiMedia;
}

export interface ComponentSharedQuote {
	__component: "shared.quote";
	id: number;
	title: string;
	body: string;
}

export interface ComponentSharedRichText {
	__component: "shared.rich-text";
	id: number;
	body: string; // Markdown or HTML depending on Strapi config
}

export interface ComponentSharedSlider {
	__component: "shared.slider";
	id: number;
	files: StrapiMedia[];
}

export type ArticleBlock =
	| ComponentSharedMedia
	| ComponentSharedQuote
	| ComponentSharedRichText
	| ComponentSharedSlider;

export interface Article {
	id: number;
	documentId: string;
	title: string;
	description: string;
	slug: string;
	cover?: StrapiMedia;
	author?: Author;
	category?: Category;
	blocks: ArticleBlock[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string | null;
	locale: string | null;
}
