interface BlockChild {
	type: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
}

interface Block {
	type: string;
	children?: BlockChild[];
}

interface APlusImageTextData {
	image?: {
		url?: string;
	};
	title?: string;
	content?: Block[];
	imagePosition?: "left" | "right";
}

interface APlusImageTextProps {
	data: APlusImageTextData;
	strapiUrl: string;
}

const APlusImageText: React.FC<APlusImageTextProps> = ({ data, strapiUrl }) => {
	const imageUrl = data.image?.url
		? data.image.url.startsWith("http")
			? data.image.url
			: `${strapiUrl}${data.image.url}`
		: null;

	const isLeft = data.imagePosition !== "right";

	const renderBlock = (block: Block, index: number) => {
		if (block.type === "paragraph") {
			return (
				<p key={index} className="text-gray-600 leading-relaxed mb-4">
					{block.children?.map((child, cIndex) => {
						let content: React.ReactNode = child.text || "";
						if (child.bold) content = <strong key={cIndex}>{content}</strong>;
						if (child.italic) content = <em key={cIndex}>{content}</em>;
						return content;
					})}
				</p>
			);
		}
		if (block.type === "heading") {
			return (
				<h4 key={index} className="text-xl font-semibold text-gray-800 mb-3">
					{block.children?.map((child) => child.text).join("")}
				</h4>
			);
		}
		return null;
	};

	return (
		<div
			className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
		>
			{/* Image */}
			<div className="w-full md:w-1/2">
				{imageUrl && (
					<img
						src={imageUrl}
						alt={data.title || "Product detail"}
						className="w-full h-auto rounded-2xl shadow-lg object-cover"
					/>
				)}
			</div>

			{/* Text Content */}
			<div className="w-full md:w-1/2 space-y-4">
				{data.title && (
					<h3 className="text-2xl font-bold text-primary mb-4">{data.title}</h3>
				)}
				<div className="prose prose-gray max-w-none">
					{data.content?.map((block, index) => renderBlock(block, index))}
				</div>
			</div>
		</div>
	);
};

export default APlusImageText;
