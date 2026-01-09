import { updateCustomer } from "@/lib/data/customer";
import { Controller, useForm } from "react-hook-form";
import { z } from "astro/zod";
import AccountInfo from "./AccountInfo";
import type { HttpTypes, StoreCustomer } from "@medusajs/types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export const profileNameSchema = z.object({
  firstName: z.string().nonempty("First name is required."),
  lastName: z.string().nonempty("Last name is required."),
});

const ProfileName = ({
  customer,
  setCustomer,
}: {
  customer: HttpTypes.StoreCustomer;
  setCustomer: Dispatch<SetStateAction<StoreCustomer | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { control, handleSubmit, setValue } = useForm<
    z.infer<typeof profileNameSchema>
  >({
    resolver: zodResolver(profileNameSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.first_name || "");
      setValue("lastName", customer.last_name || "");
    }
  }, [customer]);

  const updateCustomerName = async (
    data: z.infer<typeof profileNameSchema>
  ) => {
    setLoading(true);

    const customer = {
      first_name: data.firstName,
      last_name: data.lastName,
    };

    try {
      const res = await updateCustomer(customer);
      setCustomer(res);
      setSuccessState(true);
    } catch (error: any) {
      if (error instanceof Error) {
        setErrorMsg(error.message || "Something went wrong");
      } else {
        setErrorMsg("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setSuccessState(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(updateCustomerName)}>
        <AccountInfo
          label="Name"
          currentInfo={`${customer.first_name} ${customer.last_name}`}
          clearState={clearState}
          isSuccess={successState}
          isError={!!errorMsg}
          errorMessage={errorMsg}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="First Name"
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
              name="lastName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Last Name"
                    className="bg-white"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </AccountInfo>
      </form>
    </>
  );
};

export default ProfileName;
