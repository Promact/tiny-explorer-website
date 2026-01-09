import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addCustomerAddress,
  addressSchema,
  updateCustomerAddress,
} from "@/lib/data/customer";
import { customerNS } from "@/nanostores/customerStore";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StoreCustomerAddress, StoreRegion } from "@medusajs/types";
import { z } from "astro/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const AddressFormDialog = ({
  state,
  onOpenChange,
  region,
  address,
}: {
  state: boolean;
  onOpenChange: () => void;
  region: StoreRegion;
  address?: StoreCustomerAddress;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setValue, watch, reset } = useForm<
    z.infer<typeof addressSchema>
  >({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      company: "",
      postalCode: "",
      city: "",
      countryCode: "",
      province: "",
      phone: "",
    },
  });

  const watchCountry = watch("countryCode");

  const countryOptions = useMemo(() => {
    if (!region) {
      return [];
    }

    return region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [region]);

  useEffect(() => {
    // Address comes, if form is opened up for editing. Here current address require to update.
    // If no address, then it is considered that form is opened up to add new address.
    if (address) {
      setValue("firstName", address?.first_name || "");
      setValue("lastName", address?.last_name || "");
      setValue("address1", address.address_1 || "");
      setValue("company", address.company || "");
      setValue("postalCode", address.postal_code || "");
      setValue("city", address.city || "");
      setValue("countryCode", address.country_code || "");
      setValue("province", address.province || "");
      setValue("phone", address.phone || "");
    }
  }, [address]);

  // Writting this use effect, as it seems there is some issue with shadcn select and react hook form.
  useEffect(() => {
    if (watchCountry === "" && address && address?.country_code) {
      setValue("countryCode", address?.country_code);
    }
  }, [watchCountry]);

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    try {
      setIsSubmitting(true);
      if (address) {
        const res = await updateCustomerAddress(data, address.id);
        customerNS.set(res);
        onOpenChange();
        reset();
      } else {
        const res = await addCustomerAddress(data);
        customerNS.set(res);
        onOpenChange();
        reset();
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (data: any) => {
    // console.log(data);
  };

  return (
    <>
      <Dialog open={state} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle>Add Address</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="shipping-firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="First Name *"
                      disabled={isSubmitting}
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
                      id="shipping-lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Last Name *"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="address1"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <Input
                      {...field}
                      id="shipping-address1"
                      aria-invalid={fieldState.invalid}
                      placeholder="Address *"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="company"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="shipping-company"
                      aria-invalid={fieldState.invalid}
                      placeholder="Company"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="postalCode"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="shipping-postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder="Postal Code *"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="shipping-city"
                      aria-invalid={fieldState.invalid}
                      placeholder="City *"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="countryCode"
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                      defaultValue=""
                    >
                      <SelectTrigger id="shipping-country" className="w-full">
                        <SelectValue placeholder="Country *" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {countryOptions?.map((item) => (
                          <SelectItem
                            key={item?.value}
                            value={item?.value as string}
                          >
                            {item?.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="province"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="shipping-province"
                      aria-invalid={fieldState.invalid}
                      placeholder="State / Province *"
                      disabled={isSubmitting}
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
                    <Input
                      {...field}
                      id="shipping-phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="Phone *"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressFormDialog;
