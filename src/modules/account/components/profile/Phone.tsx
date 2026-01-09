import { updateCustomer } from "@/lib/data/customer";
import { Controller, useForm } from "react-hook-form";
import { z } from "astro/zod";
import AccountInfo from "./AccountInfo";
import type { HttpTypes, StoreCustomer } from "@medusajs/types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export const phoneSchema = z.object({
  phone: z.string(),
});

const Phone = ({
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
    z.infer<typeof phoneSchema>
  >({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if (customer) {
      setValue("phone", customer.phone || "");
    }
  }, [customer]);

  const updateCustomerName = async (data: z.infer<typeof phoneSchema>) => {
    setLoading(true);

    const customer = {
      phone: data.phone,
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
          label="Phone"
          currentInfo={customer.phone}
          clearState={clearState}
          isSuccess={successState}
          isError={!!errorMsg}
          errorMessage={errorMsg}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="tel"
                    id="phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="Phone"
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

export default Phone;
