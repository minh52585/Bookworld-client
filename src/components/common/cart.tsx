import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(data);
  }, []);

  const increaseQuantity = (id: number) => {
    setCartItems((items) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((items) => {
      const updated = items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      // Lưu lại vào localStorage
      localStorage.setItem("cart", JSON.stringify(updated));

      return updated;
    });
  };

  const TrashIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-md p-8">
        <div className="flex items-center justify-center mb-10">
          <ShoppingCart className="text-purple-700 w-8 h-8 mr-3" />
          <h1 className="text-3xl font-extrabold text-purple-700">Giỏ Hàng</h1>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600 text-sm uppercase">
              <th className="p-3 w-[15%]">Ảnh</th>
              <th className="p-3 text-center w-[15%]">Tên sản phẩm</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3 text-center w-[10%]">Giá</th>
              <th className="p-3 text-center w-[15%]">Số lượng</th>
              <th className="p-3 text-center w-[10%]">Tổng</th>
              <th className="p-3 text-center w-[10%]">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr
                id={`cart-item-${item.id}`}
                key={item.id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                {/* Ảnh */}
                <td className="p-3 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                </td>

                {/* Tên sản phẩm */}
                <td className="p-3 text-center font-semibold text-gray-800">
                  {item.title || item.name}
                </td>

                {/* Mô tả */}
                <td className="p-3 text-gray-600">{item.description}</td>

                {/* Giá */}
                <td className="p-3 text-center text-purple-700 font-semibold">
                  {(item.price ?? 0).toLocaleString()} đ
                </td>

                {/* Số lượng */}
                <td className="p-3 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold hover:bg-purple-700 transition"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium text-gray-800 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold hover:bg-purple-700 transition"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Tổng */}
                <td className="p-3 text-center font-semibold text-gray-700">
                  {((item.price ?? 0) * item.quantity).toLocaleString()} đ
                </td>

                {/* Xóa */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-10">
          <div className="bg-white border rounded-2xl shadow-md p-6 w-80">
            <h2 className="text-lg font-bold text-purple-700 mb-3 text-center">
              Tổng Đơn hàng
            </h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Tổng tiền</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 mb-5">
              <span>Tổng thanh toán</span>
              <span>{total.toLocaleString()} đ</span>
            </div>
            <button className="bg-purple-600 text-white w-full py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition">
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
