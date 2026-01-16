const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchStore(slug: string) {
  const res = await fetch(`${API_URL}/public/stores/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProducts(slug: string) {
  const res = await fetch(`${API_URL}/public/stores/${slug}/products`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProduct(slug: string, productId: string) {
  const res = await fetch(`${API_URL}/public/stores/${slug}/products/${productId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createCart(slug: string) {
  const res = await fetch(`${API_URL}/public/stores/${slug}/cart`, {
    method: "POST",
  });
  return res.json();
}

export async function addCartItem(
  slug: string,
  cartId: string,
  productId: string,
  qty: number
) {
  const res = await fetch(`${API_URL}/public/stores/${slug}/cart/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, productId, qty }),
  });
  return res.json();
}

export async function checkout(
  slug: string,
  cartId: string,
  providerCode: string,
  paymentMethod?: string
) {
  const res = await fetch(`${API_URL}/public/stores/${slug}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, providerCode, paymentMethod }),
  });
  return res.json();
}
