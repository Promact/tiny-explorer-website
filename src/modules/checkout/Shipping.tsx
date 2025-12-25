import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { setShippingMethod } from "@/lib/data/cart";
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment";
import { convertToLocale } from "@/lib/util/money";
import type {
  HttpTypes,
  StoreCart,
  StoreCartShippingOption,
} from "@medusajs/types";
import { CircleCheck } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const PICKUP_OPTION_ON = "__PICKUP_ON";
const PICKUP_OPTION_OFF = "__PICKUP_OFF";

const Shipping = ({
  cart,
  currentStep,
  setCurrentStep,
  setCart,
  availableShippingMethods,
}: {
  cart: HttpTypes.StoreCart;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setCart: Dispatch<SetStateAction<StoreCart | null>>;
  availableShippingMethods: StoreCartShippingOption[] | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );

  const _shippingMethods = availableShippingMethods?.filter(
    // @ts-expect-error type error
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  );

  const _pickupMethods = availableShippingMethods?.filter(
    // @ts-expect-error type error
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  );

  const hasPickupOptions = !!_pickupMethods?.length;

  useEffect(() => {
    setIsLoadingPrices(true);

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id));

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {};
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!));

          setCalculatedPricesMap(pricesMap);
          setIsLoadingPrices(false);
        });
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON);
    }
  }, [availableShippingMethods]);

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    console.log({ id, variant });
    setError(null);

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON);
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF);
    }

    let currentId: string | null = null;
    setIsLoading(true);
    setShippingMethodId((prev) => {
      currentId = prev;
      return id;
    });

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId);

        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    setCurrentStep(3);
  };

  useEffect(() => {
    setError(null);
  }, [currentStep]);

  return (
    <>
      <div className="bg-white">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="flex flex-row items-baseline gap-x-2">
            <h2>Delivery</h2>
            {currentStep > 2 && <CircleCheck size="14px" />}
          </div>
          {currentStep > 2 && (
            <Button variant="ghost" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
        {currentStep == 2 && (
          <>
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-medium">Shipping method</span>
                <span className="mb-4">
                  How would you like you order delivered
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onValueChange={(v) =>
                      handleSetShippingMethod(v, "shipping")
                    }
                  >
                    {_shippingMethods?.map((option) => {
                      const isDisabled =
                        option.price_type === "calculated" &&
                        !isLoadingPrices &&
                        typeof calculatedPricesMap[option.id] !== "number";
                      console.log({ isDisabled });
                      return (
                        <FieldLabel
                          key={option.id}
                          htmlFor={option.id}
                          className="cursor-pointer"
                        >
                          <Field orientation="horizontal">
                            <RadioGroupItem
                              value={option.id}
                              data-testid="delivery-option-radio"
                              disabled={isDisabled}
                              id={option.id}
                            />
                            <FieldContent>
                              <FieldTitle>{option?.name}</FieldTitle>
                              <FieldDescription>
                                {option.price_type === "flat" ? (
                                  convertToLocale({
                                    amount: option.amount!,
                                    currency_code: cart?.currency_code,
                                  })
                                ) : calculatedPricesMap[option.id] ? (
                                  convertToLocale({
                                    amount: calculatedPricesMap[option.id],
                                    currency_code: cart?.currency_code,
                                  })
                                ) : isLoadingPrices ? (
                                  <Spinner />
                                ) : (
                                  "-"
                                )}
                              </FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div>
              {error && (
                <div className="pt-2 text-destructive text-sm">{error}</div>
              )}

              <Button onClick={handleSubmit}>
                {isLoading ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>Continue to payment</>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Shipping;
