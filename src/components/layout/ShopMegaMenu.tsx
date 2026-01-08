import type React from "react";
import { useState, useRef } from "react";

interface CategoryItem {
	name: string;
	href: string;
	image: string;
	description: string;
}

const categories: CategoryItem[] = [
	{
		name: "Play Sofa",
		href: "/shop/play-sofa",
		image: "/images/categories/play-sofa.jpg",
		description: "Modular play sofas for endless adventures",
	},
	{
		name: "Covers",
		href: "/shop/covers",
		image: "/images/categories/covers.jpg",
		description: "Stylish and durable replacement covers",
	},
	{
		name: "Waterproof Liners",
		href: "/shop/waterproof-liners",
		image: "/images/categories/liners.jpg",
		description: "Protect your play sofa from spills",
	},
	{
		name: "Decor & Toys",
		href: "/shop/decor-toys",
		image: "/images/categories/decor-toys.jpg",
		description: "Complete the play experience",
	},
];

export const ShopMegaMenu: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, 150);
	};

	return (
		<div
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Shop Trigger */}
			<button
				type="button"
				className="text-text-main hover:text-primary font-medium transition-colors flex items-center gap-1"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				Shop
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				>
					<title>Toggle menu</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19.5 8.25l-7.5 7.5-7.5-7.5"
					/>
				</svg>
			</button>

			{/* Mega Menu Dropdown */}
			<div
				className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${
					isOpen
						? "opacity-100 scale-100 visible"
						: "opacity-0 scale-95 invisible"
				}`}
				style={{ zIndex: 100 }}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-primary/10 to-secondary/30 px-6 py-4 border-b border-gray-100">
					<h3 className="text-lg font-semibold text-text-main">
						Shop by Category
					</h3>
					<p className="text-sm text-text-muted">
						Discover our range of play furniture and accessories
					</p>
				</div>

				{/* Categories Grid */}
				<div className="p-6">
					<div className="grid grid-cols-4 gap-4">
						{categories.map((category) => (
							<a
								key={category.name}
								href={category.href}
								className="group block rounded-xl overflow-hidden bg-gray-50 hover:bg-white border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300"
							>
								{/* Image Container */}
								<div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
									<img
										src={category.image}
										alt={category.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										onError={(e) => {
											// Fallback to placeholder if image fails
											const target = e.target as HTMLImageElement;
											target.style.display = "none";
											target.nextElementSibling?.classList.remove("hidden");
										}}
									/>
									{/* Placeholder fallback */}
									<div className="hidden absolute inset-0 flex items-center justify-center">
										<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-8 h-8 text-primary"
											>
												<title>{category.name}</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
												/>
											</svg>
										</div>
									</div>
								</div>

								{/* Category Info */}
								<div className="p-3 text-center">
									<h4 className="font-semibold text-text-main group-hover:text-primary transition-colors">
										{category.name}
									</h4>
									<p className="text-xs text-text-muted mt-1 line-clamp-2">
										{category.description}
									</p>
								</div>
							</a>
						))}
					</div>
				</div>

				{/* Footer CTA */}
				<div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
					<span className="text-sm text-text-muted">
						Free shipping on orders over ₹2,999
					</span>
					<a
						href="/shop"
						className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
					>
						View All Products
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<title>Arrow right</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	);
};
