import type { StoreCart } from "@medusajs/types";
import CartTotals from "../cart/CartTotal";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import Item from "../cart/Item";

const CheckoutSummary = ({ cart }: { cart: StoreCart }) => {
  return (
    <>
      <div className="sticky top-0 flex flex-col-reverse sm:flex-col gap-y-8 py-8 sm:py-0 ">
        <div className="w-full bg-white flex flex-col">
          <h2>In your Cart</h2>
          <CartTotals totals={cart} />
          <div>
            <Table>
              <TableBody>
                {cart?.items?.map((item) => (
                  <Item
                    key={item?.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                    type="preview"
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSummary;
