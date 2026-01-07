import type { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ProductPrice from "./ProductPrice";

interface BuyBoxProps {
	product: StoreProduct;
	selectedVariant: StoreProductVariant | undefined;
	isValidVariant: boolean;
	inStock: boolean;
	qty: number;
	handleQtyChange: (qty: number) => void;
	addToCartAction: () => void;
	isAdding: boolean;
	staticContent?: any; // ProductPageContent
}

const BuyBox = ({
	product,
	selectedVariant,
	isValidVariant,
	inStock,
	qty,
	handleQtyChange,
	addToCartAction,
	isAdding,
	staticContent,
}: BuyBoxProps) => {
	const renderRichText = (nodes: any) => {
		if (!nodes) return null;
		// Simple text renderer for blocks or string
		if (typeof nodes === "string")
			return <div dangerouslySetInnerHTML={{ __html: nodes }} />; // Fallback if regular string
		if (Array.isArray(nodes)) {
			return nodes.map((block: any, i: number) => {
				if (block.type === "paragraph") {
					return (
						<p key={i} className="mb-1">
							{block.children?.map((c: any) => c.text).join("")}
						</p>
					);
				}
				return null;
			});
		}
		return null;
	};

	return (
		<div className="border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24 bg-white">
			<div className="mb-4">
				<ProductPrice product={product} variant={selectedVariant} />
				<div className="text-sm text-gray-500 mt-1">Inclusive of all taxes</div>
			</div>

			{staticContent?.shippingInfo && (
				<div className="mb-4 text-sm text-gray-700 flex gap-2">
					<Truck className="w-5 h-5 text-gray-400 shrink-0" />
					<div>{renderRichText(staticContent.shippingInfo)}</div>
				</div>
			)}

			<div className="mb-6">
				<div className="font-medium text-green-700 text-lg mb-2">
					{inStock ? "In Stock" : "Currently Unavailable"}
				</div>
			</div>

			<div className="flex items-center justify-between mb-4">
				<span className="text-sm font-medium">Quantity:</span>
				<div className="flex items-center border border-gray-300 rounded-md">
					<button
						onClick={() => handleQtyChange(qty - 1)}
						className="p-1 hover:bg-gray-100 disabled:opacity-50"
						disabled={qty <= 1}
					>
						<Minus size={16} />
					</button>
					<span className="w-8 text-center">{qty}</span>
					<button
						onClick={() => handleQtyChange(qty + 1)}
						className="p-1 hover:bg-gray-100"
					>
						<Plus size={16} />
					</button>
				</div>
			</div>

			<Button
				type="button"
				disabled={!inStock || isAdding || !isValidVariant}
				onClick={addToCartAction}
				className="w-full rounded-full mb-3"
				size="lg"
			>
				{isAdding ? <Spinner /> : "Add to Cart"}
			</Button>

			<div className="flex items-center gap-2 text-xs text-gray-500 my-4">
				<ShieldCheck className="w-4 h-4" />
				<span>
					{staticContent?.secureTransactionText || "Secure transaction"}
				</span>
			</div>

			{staticContent?.returnPolicy && (
				<div className="text-sm text-blue-600 hover:underline cursor-pointer flex gap-2 items-center">
					<RotateCcw className="w-4 h-4" />
					<span>Return Policy</span>
				</div>
			)}

			{/* Sidebar Promo */}
			{staticContent?.sidebarPromoTitle && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<h4 className="font-bold text-sm mb-1">
						{staticContent.sidebarPromoTitle}
					</h4>
					<p className="text-xs text-gray-600">
						{staticContent.sidebarPromoText}
					</p>
				</div>
			)}
		</div>
	);
};

export default BuyBox;
