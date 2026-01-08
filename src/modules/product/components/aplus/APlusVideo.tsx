import { Play } from "lucide-react";
import { useState } from "react";

interface APlusVideoData {
	title?: string;
	videoUrl: string;
	thumbnail?: {
		url?: string;
	};
}

interface APlusVideoProps {
	data: APlusVideoData;
	strapiUrl: string;
}

const APlusVideo: React.FC<APlusVideoProps> = ({ data, strapiUrl }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const thumbnailUrl = data.thumbnail?.url
		? data.thumbnail.url.startsWith("http")
			? data.thumbnail.url
			: `${strapiUrl}${data.thumbnail.url}`
		: null;

	// Extract video ID and create embed URL
	const getEmbedUrl = (url: string) => {
		// YouTube
		const youtubeMatch = url.match(
			/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
		);
		if (youtubeMatch) {
			return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
		}

		// Vimeo
		const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
		if (vimeoMatch) {
			return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
		}

		// Return as-is if already an embed URL
		return url;
	};

	return (
		<div className="max-w-4xl mx-auto">
			{data.title && (
				<h3 className="text-2xl font-bold text-primary mb-6 text-center">
					{data.title}
				</h3>
			)}
			<div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-900 shadow-xl">
				{!isPlaying ? (
					<button
						type="button"
						onClick={() => setIsPlaying(true)}
						className="absolute inset-0 flex items-center justify-center group cursor-pointer"
					>
						{thumbnailUrl && (
							<img
								src={thumbnailUrl}
								alt={data.title || "Video thumbnail"}
								className="absolute inset-0 w-full h-full object-cover"
							/>
						)}
						<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
						<div className="relative z-10 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
							<Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
						</div>
					</button>
				) : (
					<iframe
						src={getEmbedUrl(data.videoUrl)}
						title={data.title || "Video"}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 w-full h-full"
					/>
				)}
			</div>
		</div>
	);
};

export default APlusVideo;
