interface APlusHeroData {
	backgroundImage?: {
		url?: string;
	};
	headline?: string;
	subheadline?: string;
	alignment?: "left" | "center" | "right";
}

interface APlusHeroProps {
	data: APlusHeroData;
	strapiUrl: string;
}

const APlusHero: React.FC<APlusHeroProps> = ({ data, strapiUrl }) => {
	const imageUrl = data.backgroundImage?.url
		? data.backgroundImage.url.startsWith("http")
			? data.backgroundImage.url
			: `${strapiUrl}${data.backgroundImage.url}`
		: null;

	const alignmentClasses = {
		left: "text-left items-start",
		center: "text-center items-center",
		right: "text-right items-end",
	};

	const alignment = data.alignment || "center";

	return (
		<div className="relative w-full min-h-[400px] rounded-2xl overflow-hidden">
			{imageUrl && (
				<img
					src={imageUrl}
					alt={data.headline || "Hero banner"}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
			<div
				className={`relative z-10 flex flex-col justify-end h-full min-h-[400px] p-8 ${alignmentClasses[alignment]}`}
			>
				{data.headline && (
					<h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
						{data.headline}
					</h3>
				)}
				{data.subheadline && (
					<p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow">
						{data.subheadline}
					</p>
				)}
			</div>
		</div>
	);
};

export default APlusHero;
