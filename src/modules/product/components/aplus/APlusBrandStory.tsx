import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BrandSlide {
	id?: number;
	image?: {
		url?: string;
	};
	caption?: string;
	description?: string;
}

interface APlusBrandStoryData {
	title?: string;
	logo?: {
		url?: string;
	};
	slides?: BrandSlide[];
}

interface APlusBrandStoryProps {
	data: APlusBrandStoryData;
	strapiUrl: string;
}

const APlusBrandStory: React.FC<APlusBrandStoryProps> = ({
	data,
	strapiUrl,
}) => {
	const slides = data.slides || [];

	const getImageUrl = (url?: string) => {
		if (!url) return null;
		return url.startsWith("http") ? url : `${strapiUrl}${url}`;
	};

	const logoUrl = getImageUrl(data.logo?.url);

	return (
		<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white overflow-hidden">
			{/* Header with Logo */}
			<div className="flex items-center justify-center gap-4 mb-8">
				{logoUrl && (
					<img
						src={logoUrl}
						alt="Brand logo"
						className="h-12 w-auto object-contain"
					/>
				)}
				{data.title && <h3 className="text-2xl font-bold">{data.title}</h3>}
			</div>

			{/* Carousel */}
			{slides.length > 0 && (
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={24}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 5000, disableOnInteraction: false }}
					breakpoints={{
						640: { slidesPerView: 2 },
						1024: { slidesPerView: 3 },
					}}
					className="brand-story-swiper"
				>
					{slides.map((slide, index) => {
						const slideImageUrl = getImageUrl(slide.image?.url);
						return (
							<SwiperSlide key={slide.id || index}>
								<div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
									{slideImageUrl && (
										<img
											src={slideImageUrl}
											alt={slide.caption || `Slide ${index + 1}`}
											className="w-full h-48 object-cover"
										/>
									)}
									<div className="p-4">
										{slide.caption && (
											<h4 className="font-semibold text-white mb-2">
												{slide.caption}
											</h4>
										)}
										{slide.description && (
											<p className="text-sm text-white/70 leading-relaxed">
												{slide.description}
											</p>
										)}
									</div>
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>
			)}

			{/* Custom Swiper Styles */}
			<style>{`
				.brand-story-swiper .swiper-button-next,
				.brand-story-swiper .swiper-button-prev {
					color: white;
					background: rgba(255, 255, 255, 0.1);
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
				.brand-story-swiper .swiper-button-next:after,
				.brand-story-swiper .swiper-button-prev:after {
					font-size: 16px;
				}
				.brand-story-swiper .swiper-pagination-bullet {
					background: white;
					opacity: 0.5;
				}
				.brand-story-swiper .swiper-pagination-bullet-active {
					opacity: 1;
				}
			`}</style>
		</div>
	);
};

export default APlusBrandStory;
