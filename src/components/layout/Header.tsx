import type React from "react";
import { useState } from "react";
import { CartCounter } from "../cart/CartCounter";
import { Container } from "../common/Container";
import { Button } from "../ui/button";
import { ShopMegaMenu } from "./ShopMegaMenu";

export const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navLinks = [
		{ name: "About Us", href: "/about" },
		{ name: "TinyVerse", href: "/tinyverse" },
		{ name: "Blog", href: "/blog" },
		{ name: "Contact", href: "/contact" },
	];

	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100">
			<Container>
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<a href="/" className="flex items-center">
						<img
							src="/logo.png"
							alt="Tiny Explorer"
							className="h-12 w-auto object-contain"
						/>
					</a>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex gap-8 items-center">
						{/* Shop Mega Menu */}
						<ShopMegaMenu />

						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-text-main hover:text-primary font-medium transition-colors"
							>
								{link.name}
							</a>
						))}
					</nav>

					{/* Actions */}
					<div className="hidden md:flex items-center gap-4">
						{/* Placeholder for Search/Cart */}
						<CartCounter />
						<Button asChild>
							<a href="/shop">Shop Now</a>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center gap-2">
						<CartCounter />
						<button
							type="button"
							className="md:hidden p-2 text-text-main"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<title>Menu</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d={
										isMenuOpen
											? "M6 18L18 6M6 6l12 12"
											: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									}
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<nav className="md:hidden py-4 border-t border-gray-100 absolute left-0 right-0 bg-background shadow-lg">
						<div className="flex flex-col gap-2 px-4">
							{/* Shop Section with Categories */}
							<div className="py-2">
								<a
									href="/shop"
									className="text-text-main font-semibold text-lg block mb-2"
									onClick={() => setIsMenuOpen(false)}
								>
									Shop
								</a>
								<div className="pl-4 flex flex-col gap-1 border-l-2 border-primary/20">
									<a
										href="/shop/play-sofa"
										className="text-text-muted hover:text-primary text-sm py-1"
										onClick={() => setIsMenuOpen(false)}
									>
										Play Sofa
									</a>
									<a
										href="/shop/covers"
										className="text-text-muted hover:text-primary text-sm py-1"
										onClick={() => setIsMenuOpen(false)}
									>
										Covers
									</a>
									<a
										href="/shop/waterproof-liners"
										className="text-text-muted hover:text-primary text-sm py-1"
										onClick={() => setIsMenuOpen(false)}
									>
										Waterproof Liners
									</a>
									<a
										href="/shop/decor-toys"
										className="text-text-muted hover:text-primary text-sm py-1"
										onClick={() => setIsMenuOpen(false)}
									>
										Decor & Toys
									</a>
								</div>
							</div>

							{/* Other Nav Links */}
							{navLinks.map((link) => (
								<a
									key={link.name}
									href={link.href}
									className="text-text-main hover:text-primary font-medium text-lg py-2"
									onClick={() => setIsMenuOpen(false)}
								>
									{link.name}
								</a>
							))}
							<Button asChild>
								<a href="/shop">Shop Now</a>
							</Button>
						</div>
					</nav>
				)}
			</Container>
		</header>
	);
};
