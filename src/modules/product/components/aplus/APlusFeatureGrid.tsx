interface FeatureItem {
	id?: number;
	icon?: {
		url?: string;
	};
	title: string;
	description?: string;
}

interface APlusFeatureGridData {
	title?: string;
	features?: FeatureItem[];
}

interface APlusFeatureGridProps {
	data: APlusFeatureGridData;
	strapiUrl: string;
}

const APlusFeatureGrid: React.FC<APlusFeatureGridProps> = ({
	data,
	strapiUrl,
}) => {
	const features = data.features || [];

	if (features.length === 0) {
		return null;
	}

	const getImageUrl = (url?: string) => {
		if (!url) return null;
		return url.startsWith("http") ? url : `${strapiUrl}${url}`;
	};

	return (
		<div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8">
			{data.title && (
				<h3 className="text-2xl font-bold text-primary mb-8 text-center">
					{data.title}
				</h3>
			)}
			<div
				className={`grid gap-6 ${
					features.length <= 3
						? "grid-cols-1 md:grid-cols-3"
						: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
				}`}
			>
				{features.map((feature, index) => (
					<div
						key={feature.id || index}
						className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
					>
						{feature.icon?.url && (
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
								<img
									src={getImageUrl(feature.icon.url) || ""}
									alt={feature.title}
									className="w-8 h-8 object-contain"
								/>
							</div>
						)}
						<h4 className="font-semibold text-lg text-gray-900 mb-2">
							{feature.title}
						</h4>
						{feature.description && (
							<p className="text-sm text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default APlusFeatureGrid;
