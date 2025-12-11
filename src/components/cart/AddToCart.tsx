import React, { useState } from 'react';
import { Button } from '../common/Button';
import { addToCart } from '../../lib/cart';

interface AddToCartProps {
  variants: any[];
}

export const AddToCart: React.FC<AddToCartProps> = ({ variants }) => {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!variants?.length) return;
    setLoading(true);
    try {
      // Default to first variant for now
      const variantId = variants[0].id;
      await addToCart(variantId, 1);
      alert("Added to cart!"); // Temporary feedback
      // Dispatch event to update cart count if we have a listener
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAdd} disabled={loading} size="lg" fullWidth className="text-lg">
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
};
