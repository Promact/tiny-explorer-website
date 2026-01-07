import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	fullWidth = false,
	className = "",
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
		secondary:
			"bg-secondary text-text-main hover:bg-gray-200 focus:ring-secondary",
		outline:
			"border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary",
		ghost: "text-primary hover:bg-primary/10 focus:ring-primary",
	};

	const sizes = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
