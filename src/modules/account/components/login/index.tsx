import { Controller, useForm } from "react-hook-form";
import { z } from "astro/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, signinSchema } from "@/lib/data/customer";
import { Alert, AlertTitle } from "@/components/ui/alert";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

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
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error?.message || "Something went wrong");
        console.log(error);
      } else {
        setErrorMsg("Something went wrong");
      }
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
          className="w-full flex flex-col gap-y-5 mb-4"
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
                  className="bg-white"
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
                    className="bg-white"
                  />
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0.5 top-0.5 bg-white"
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
          {errorMsg && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>{errorMsg}</AlertTitle>
            </Alert>
          )}
          <Button type="submit" className="full-w">
            Submit
          </Button>
        </form>
        <p className="text-sm">
          Not a member?{" "}
          <a href="/account/register" className="text-primary underline">
            Join us
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
