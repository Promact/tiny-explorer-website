import { retrieveCart } from "@/lib/data/cart";
import type { StoreCart } from "@medusajs/types";
import { useCallback, useEffect, useState } from "react";
import Items from "./Items";
import CartTotals from "./CartTotal";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";

const CartShell = () => {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCart = useCallback(async () => {
    const res = await retrieveCart();
    setCart(res);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance my-4">
        Cart
      </h1>

      {cart && cart?.items && cart?.items?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-x-40">
            <div>
              <Items cart={cart} setCart={setCart} />
            </div>
            <div>
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
                Summary
              </h2>
              <div className="mb-8">
                <CartTotals totals={cart} />
              </div>
              <Button asChild className="w-full mb-8">
                <a href="/checkout">Checkout</a>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 mb-6">
            You don't have anything in your cart. Let's change that, use the
            link below to start browsing our products.
          </p>
          <a
            href="/shop"
            className="flex gap-x-1 items-center group text-primary"
          >
            <span>Expore Products</span>
            <MoveUpRight
              className="group-hover:rotate-45 ease-in-out duration-150"
              size="20px"
            />
          </a>
        </>
      )}
    </>
  );
};

export default CartShell;
