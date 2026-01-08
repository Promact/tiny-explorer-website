import { Check, Minus, X } from "lucide-react";

interface ComparisonProduct {
	id?: number;
	name: string;
	image?: {
		url?: string;
	};
	isHighlighted?: boolean;
}

interface ComparisonFeature {
	id?: number;
	featureName: string;
	values: (boolean | string)[];
}

interface APlusComparisonChartData {
	title?: string;
	products?: ComparisonProduct[];
	features?: ComparisonFeature[];
}

interface APlusComparisonChartProps {
	data: APlusComparisonChartData;
	strapiUrl: string;
}

const APlusComparisonChart: React.FC<APlusComparisonChartProps> = ({
	data,
	strapiUrl,
}) => {
	const products = data.products || [];
	const features = data.features || [];

	if (products.length === 0 || features.length === 0) {
		return null;
	}

	const getImageUrl = (url?: string) => {
		if (!url) return null;
		return url.startsWith("http") ? url : `${strapiUrl}${url}`;
	};

	const renderValue = (value: boolean | string) => {
		if (typeof value === "boolean") {
			return value ? (
				<Check className="w-5 h-5 text-green-500 mx-auto" />
			) : (
				<X className="w-5 h-5 text-red-400 mx-auto" />
			);
		}
		if (value === "-" || value === "") {
			return <Minus className="w-5 h-5 text-gray-300 mx-auto" />;
		}
		return <span className="text-sm text-gray-700">{value}</span>;
	};

	return (
		<div className="overflow-x-auto">
			{data.title && (
				<h3 className="text-2xl font-bold text-primary mb-6 text-center">
					{data.title}
				</h3>
			)}
			<table className="w-full border-collapse">
				<thead>
					<tr>
						<th className="p-4 text-left bg-gray-50 border-b-2 border-gray-200" />
						{products.map((product, index) => (
							<th
								key={product.id || index}
								className={`p-4 text-center border-b-2 ${
									product.isHighlighted
										? "bg-primary/10 border-primary"
										: "bg-gray-50 border-gray-200"
								}`}
							>
								{product.image?.url && (
									<img
										src={getImageUrl(product.image.url) || ""}
										alt={product.name}
										className="w-16 h-16 object-contain mx-auto mb-2"
									/>
								)}
								<span
									className={`font-semibold ${product.isHighlighted ? "text-primary" : "text-gray-800"}`}
								>
									{product.name}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{features.map((feature, fIndex) => (
						<tr
							key={feature.id || fIndex}
							className={fIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
						>
							<td className="p-4 font-medium text-gray-700 border-b border-gray-100">
								{feature.featureName}
							</td>
							{feature.values.map((value, vIndex) => (
								<td
									key={vIndex}
									className={`p-4 text-center border-b border-gray-100 ${
										products[vIndex]?.isHighlighted ? "bg-primary/5" : ""
									}`}
								>
									{renderValue(value)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default APlusComparisonChart;
