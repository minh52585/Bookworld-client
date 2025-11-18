import React, { useState } from "react";
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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Đắc nhân tâm",
      description: "Nghệ thuật giao tiếp và ứng xử.",
      price: 100000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      title: "Another Book",
      description: "A mysterious story unfolds.",
      price: 18000,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop",
    },
  ]);

  const increaseQuantity = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity < 20
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  
  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
  
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
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
          <h1 className="text-3xl font-extrabold text-purple-700">
            Giỏ Hàng
          </h1>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600 text-sm uppercase">
              <th className="p-3 w-[25%]">Sản phẩm</th>
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
                <td className="p-3 flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover mr-4"
                  />
                  <span className="font-semibold text-gray-800">
                    {item.title}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{item.description}</td>
                <td className="p-3 text-center text-purple-700 font-semibold">
                  {item.price.toLocaleString()} đ
                </td>
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
                <td className="p-3 text-center font-semibold text-gray-700">
                  {(item.price * item.quantity).toLocaleString()} đ
                </td>
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

