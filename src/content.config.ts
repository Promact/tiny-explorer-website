import { defineCollection, z } from 'astro:content';
import { strapiLoader } from './lib/strapi-loader';

const blog = defineCollection({
    loader: strapiLoader({
        contentType: 'articles', // Assuming 'articles' is the content type in Strapi
    }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        slug: z.string(),
        cover: z.object({
            url: z.string(),
            alternativeText: z.string().nullable().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
        }).optional(),
        author: z.object({
            name: z.string(),
            email: z.string().optional(),
        }).optional(),
        category: z.object({
            name: z.string(),
            slug: z.string(),
        }).optional(),
        blocks: z.array(z.any()).optional(),
        publishedAt: z.coerce.date().optional(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
    }),
});

const about = defineCollection({
    loader: strapiLoader({
        contentType: 'about-page',
        queryParams: {
            populate: '*', // Populate everything for single type
        },
        isSingleType: true,
    }),
    schema: z.object({
        hero: z.object({
            title: z.string(),
            subtitle: z.string().optional(),
        }).optional(),
        story: z.array(z.object({
            title: z.string(),
            content: z.array(z.any()), // Rich Text blocks?
        })).optional(),
        seo: z.object({
            metaTitle: z.string(),
            metaDescription: z.string().optional(),
        }).optional(),
    }),
});


const homepage = defineCollection({
    loader: strapiLoader({
        contentType: 'home-page',
        queryParams: {
            populate: {
                hero: {
                    populate: '*',
                },
                features: {
                    populate: '*',
                },
                useCases: {
                    populate: '*',
                },
                audience: {
                    populate: '*',
                },
                testimonials: {
                    populate: {
                        testimonials: {
                            populate: '*',
                        }
                    }
                },
                cta: {
                    populate: {
                        buttons: {
                            populate: '*',
                        }
                    }
                },
                learnMore: {
                    populate: {
                        cards: {
                            populate: '*',
                        }
                    }
                },
                blog: {
                    populate: '*',
                },
                seo: {
                    populate: '*',
                }
            },
        },
        isSingleType: true,
    }),
    schema: z.object({
        hero: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            ctaText: z.string().optional().nullable(),
            ctaLink: z.string().optional().nullable(),
            backgroundImage: z.object({
                url: z.string(),
                alternativeText: z.string().optional().nullable(),
                width: z.number().optional().nullable(),
                height: z.number().optional().nullable(),
            }).optional().nullable(),
        }).optional().nullable(),
        features: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            features: z.array(z.object({
                icon: z.string().optional().nullable(),
                title: z.string(),
                description: z.string().optional().nullable(),
            })).optional().nullable(),
        }).optional().nullable(),
        audience: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            audiences: z.array(z.object({
                icon: z.string().optional().nullable(),
                label: z.string(),
            })).optional().nullable(),
        }).optional().nullable(),
        useCases: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            activities: z.array(z.object({
                icon: z.string().optional().nullable(),
                label: z.string(),
            })).optional().nullable(),
            ctaText: z.string().optional().nullable(),
            ctaLink: z.string().optional().nullable(),
            image: z.object({
                url: z.string(),
                alternativeText: z.string().optional().nullable(),
                width: z.number().optional(),
                height: z.number().optional(),
            }).optional().nullable(),
        }).optional().nullable(),
        testimonials: z.object({
            title: z.string(),
            testimonials: z.array(z.object({
                author: z.string(),
                text: z.string(),
                rating: z.number().optional().nullable(),
                avatar: z.any().optional().nullable()
            })).optional().nullable()
        }).optional().nullable(),
        cta: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            buttons: z.array(z.object({
                label: z.string(),
                href: z.string(),
                variant: z.string().optional().nullable(),
                isExternal: z.boolean().optional().nullable()
            })).optional().nullable()
        }).optional().nullable(),
        learnMore: z.object({
            title: z.string(),
            cards: z.array(z.object({
                title: z.string(),
                description: z.string().optional().nullable(),
                link: z.string(),
                image: z.any().optional().nullable()
            })).optional().nullable()
        }).optional().nullable(),
        blog: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            limit: z.number().optional().nullable()
        }).optional().nullable(),
        seo: z.object({
            metaTitle: z.string(),
            metaDescription: z.string(),
            shareImage: z.object({
                url: z.string(),
            }).optional().nullable(),
        }).optional().nullable(),
    }),
});

const tinyVersePage = defineCollection({
    loader: strapiLoader({
        contentType: 'tiny-verse-page',
        queryParams: {
            populate: '*',
        },
        isSingleType: true,
    }),
    schema: z.object({
        hero: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
        }).optional().nullable(),
        intro: z.object({
            title: z.string(),
            content: z.array(z.any()), // Blocks
        }).optional().nullable(),
        materials: z.object({
            title: z.string(),
            subtitle: z.string().optional().nullable(),
            features: z.array(z.object({
                title: z.string(),
                description: z.string().optional().nullable(),
                icon: z.string().optional().nullable(),
            })).optional().nullable(),
        }).optional().nullable(),
        seo: z.object({
            metaTitle: z.string(),
            metaDescription: z.string(),
        }).optional().nullable(),
    }),
});

const tinyVerse = defineCollection({
    loader: strapiLoader({
        contentType: 'tiny-verses',
        queryParams: {
            populate: '*'
        }
    }),
    schema: z.object({
        title: z.string(),
        category: z.string(),
        image: z.object({
            url: z.string(),
            alternativeText: z.string().optional().nullable(),
        }).optional().nullable(),
    }),
});

export const collections = {
    blog,
    about,
    homepage,
    tinyVersePage,
    tinyVerse,
};
