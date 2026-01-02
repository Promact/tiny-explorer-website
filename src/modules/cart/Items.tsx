import type { StoreCart } from "@medusajs/types";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Item from "./Item";
import type { Dispatch, SetStateAction } from "react";

const Items = ({
  cart,
  setCart,
}: {
  cart: StoreCart;
  setCart: Dispatch<SetStateAction<StoreCart | null>>;
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="w-full">
            <TableHead className="pl-0 p-4 w-24">Item</TableHead>
            <TableHead></TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart?.items?.map((i) => (
            <>
              <Item
                item={i}
                currencyCode={cart?.currency_code}
                key={i?.id}
                setCart={setCart}
              />
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Items;
