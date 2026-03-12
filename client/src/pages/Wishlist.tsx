import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from "../store/api/wishlistApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import { useAppSelector } from "../hooks/redux";
import { calculateDiscount, formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: wishlist, isLoading } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  if (!isAuthenticated) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-2xl font-semibold">Please login to view your wishlist</h1>
        <Link to="/login" className="mt-4 inline-block rounded-sm bg-[#2a55e5] px-6 py-2 text-white">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="fk-page py-16 text-center text-[#878787]">Loading wishlist...</div>;
  }

  if (!wishlist?.length) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
        <Link to="/products" className="mt-4 inline-block rounded-sm bg-[#2a55e5] px-6 py-2 text-white">
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="fk-page py-3">
      <h1 className="mb-3 text-xl font-semibold text-[#212121]">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.id} className="fk-card rounded-sm bg-white p-3">
            <Link to={`/product/${item.productId}`} className="flex h-44 items-center justify-center rounded border border-[#f0f0f0] p-2">
              <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-contain" />
            </Link>
            <p className="line-clamp-2 mt-2 text-sm text-[#212121]">{item.product.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold">{formatCurrency(item.product.price)}</span>
              <span className="text-xs font-semibold text-[#388e3c]">
                {calculateDiscount(item.product.price, item.product.mrp)}% off
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={async () => {
                  await addToCart({ productId: item.productId, quantity: 1 }).unwrap();
                  toast.success("Added to cart");
                }}
                className="flex-1 rounded-sm bg-[#fb641b] py-2 text-xs font-semibold uppercase text-white"
              >
                Add to cart
              </button>
              <button
                onClick={async () => {
                  await removeFromWishlist(item.productId).unwrap();
                  toast.success("Removed");
                }}
                className="rounded-sm border border-[#d9d9d9] p-2 text-[#878787] hover:text-[#ff4343]"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
