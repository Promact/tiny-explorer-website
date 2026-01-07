import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "astro/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, signinSchema } from "@/lib/data/customer";

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	const { control, handleSubmit } = useForm<z.infer<typeof signinSchema>>({
		resolver: zodResolver(signinSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signinSchema>) => {
		try {
			const res = await login(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="w-full flex justify-center my-8">
			<div className="max-w-sm flex flex-col items-center">
				<h1 className="text-lg uppercase mb-6 text-primary">Welcome Back</h1>
				<p className="text-center text-base mb-6">
					Sign in to access an enhanced shopping experience.
				</p>
				<form
					className="w-full flex flex-col gap-y-5"
					onSubmit={handleSubmit(onSubmit)}
					method="post"
				>
					<Controller
						control={control}
						name="email"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									{...field}
									type="email"
									id="email"
									aria-invalid={fieldState.invalid}
									placeholder="Email"
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<div className="relative w-full">
									<Input
										{...field}
										type={showPassword ? "text" : "password"}
										id="password"
										aria-invalid={fieldState.invalid}
										placeholder="Password"
									/>
									<Button
										type="button"
										size="icon-sm"
										variant="ghost"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2 top-0.5"
									>
										{showPassword ? <Eye /> : <EyeOff />}
									</Button>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Button type="submit" className="full-w">
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
