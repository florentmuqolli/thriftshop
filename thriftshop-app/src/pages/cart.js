import useCart from "@/hooks/useCart";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <ul className="space-y-2">
          {cart.map(item => (
            <li key={item.id} className="flex justify-between border p-2 rounded">
              {item.name} - ${item.price}
              <button onClick={() => removeFromCart(item.id)} className="bg-red-600 text-white px-2 rounded">Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && <button onClick={clearCart} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Clear Cart</button>}
    </div>
  );
}
