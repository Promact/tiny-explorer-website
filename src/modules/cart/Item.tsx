import { TableCell, TableRow } from "@/components/ui/table";
import { HttpTypes, type StoreCart } from "@medusajs/types";
import Thumbnail from "../thumbnail/components/Thumbnail";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { convertToLocale } from "@/lib/util/money";
import { deleteLineItem, retrieveCart, updateLineItem } from "@/lib/data/cart";
import { useState, type Dispatch, type SetStateAction } from "react";

const Item = ({
  item,
  type = "full",
  currencyCode,
  setCart,
}: {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  type?: "full" | "preview";
  currencyCode: string;
  setCart?: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
  console.log({ type });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeQuantity = async (quantity: number) => {
    if (setCart) {
      try {
        setIsLoading(true);
        const res = await updateLineItem({
          lineId: item?.id,
          quantity: quantity,
        });

        const cartRes = await retrieveCart();
        setCart(cartRes);
      } catch (err) {
        if (err instanceof Error) {
          if (
            err?.message ===
            "Error setting up the request: Some variant does not have the required inventory"
          ) {
            setError(
              "The requested quantity is not available item. Please adjust and try again."
            );
          } else {
            setError(err.message);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handledelete = async (id: string) => {
    if (setCart) {
      try {
        setIsLoading(true);
        await deleteLineItem(id);

        const cartRes = await retrieveCart();
        setCart(cartRes);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="pl-0">
          <a
            href=""
            className={clsx("flex", {
              "w-16": type === "preview",
              "w-12 sm:w-24": type === "full",
            })}
          >
            <Thumbnail
              thumbnail={
                item?.variant?.metadata?.thumbnail &&
                typeof item?.variant?.metadata?.thumbnail === "string"
                  ? item?.variant?.metadata?.thumbnail
                  : item.thumbnail
              }
              images={
                item.variant?.metadata?.images &&
                Array.isArray(item.variant?.metadata?.images)
                  ? item.variant?.metadata?.images
                  : item.variant?.product?.images
              }
              size="square"
            />
          </a>
        </TableCell>
        <TableCell>
          <p className="text-primary font-bold text-base">
            {item?.product_title}
          </p>
          {item?.variant?.title && (
            <p className="overflow-hidden text-ellipsis">
              Variant: {item?.variant?.title}
            </p>
          )}
        </TableCell>
        {type === "full" && (
          <TableCell>
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => handledelete(item?.id)}
                disabled={isLoading}
              >
                <Trash2 />
              </Button>
              <div className="flex items-center border-gray-200 border rounded-lg w-fit">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer"
                  onClick={() => changeQuantity(item?.quantity - 1)}
                  disabled={item?.quantity === 1 || isLoading}
                >
                  <Minus />
                </Button>
                <span className="px-2">{item?.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer"
                  onClick={() => changeQuantity(item?.quantity + 1)}
                  disabled={isLoading}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </TableCell>
        )}
        {type === "full" && (
          <TableCell>
            <span className="text-primary">
              {item?.total &&
                convertToLocale({
                  amount: item?.total / item.quantity,
                  currency_code: currencyCode,
                })}
            </span>
          </TableCell>
        )}
        <TableCell className="pr-0 text-right">
          <span className="text-primary">
            {item?.total &&
              convertToLocale({
                amount: item?.total,
                currency_code: currencyCode,
              })}
          </span>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Item;
