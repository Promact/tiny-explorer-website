import type React from "react";
import { Button } from "../common/Button";

interface ProductCardProps {
	id: string;
	title: string;
	price: number;
	image?: string;
	category: string;
	slug: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	title,
	price,
	image,
	category,
	slug,
}) => {
	return (
		<a href={`/shop/product/${slug}`} className="group block h-full">
			<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
				{/* Image Container */}
				<div className="aspect-square bg-gray-100 relative overflow-hidden">
					{image ? (
						<img
							src={image}
							alt={title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-300">
							{/* Placeholder Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1}
								stroke="currentColor"
								className="w-12 h-12"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
								/>
							</svg>
						</div>
					)}

					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

					{/* Quick Action Overlay (Optional) */}
					<div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
						<Button size="sm" variant="secondary" className="shadow-lg">
							View
						</Button>
					</div>
				</div>

				{/* Content */}
				<div className="p-5 flex flex-col flex-grow">
					<p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
						{category}
					</p>
					<h3 className="text-lg font-bold font-heading text-text-main group-hover:text-primary transition-colors mb-2">
						{title}
					</h3>
					<div className="mt-auto flex items-center justify-between">
						<span className="text-lg font-medium text-text-main">
							₹{price.toLocaleString("en-IN")}
						</span>
					</div>
				</div>
			</div>
		</a>
	);
};
