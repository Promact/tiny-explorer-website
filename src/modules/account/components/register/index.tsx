import { Controller, useForm } from "react-hook-form";
import { z } from "astro/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, signup, signupSchema } from "@/lib/data/customer";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const res = await signup(data);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="w-full flex justify-center my-8">
      <div className="max-w-sm flex flex-col items-center">
        <h1 className="text-lg uppercase mb-6 text-primary">
          Become a Tiny Explorer member
        </h1>
        <p className="text-center text-base mb-6">
          Create your Medusa Store Member profile, and get access to an enhanced
          shopping experience.
        </p>
        <form
          className="w-full flex flex-col gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
          method="post"
        >
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  aria-invalid={fieldState.invalid}
                  placeholder="First Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="lastName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Last Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  {...field}
                  type="tel"
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Phone"
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

export default RegisterForm;
