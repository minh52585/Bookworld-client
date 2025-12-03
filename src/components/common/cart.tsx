import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";

const API_BASE_URL = "http://localhost:5004/api";

function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCartItems(res.data.data?.items || []);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
    setLoading(false);
  };

  const increaseQuantity = async (productId: string) => {
    const item = cartItems.find((i: any) => i.product_id?._id === productId);
    if (!item) return;
    const newQty = item.quantity + 1;

    try {
      await axios.put(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
          quantity: newQty,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Lỗi tăng số lượng", error);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    const item = cartItems.find((i: any) => i.product_id?._id === productId);
    if (!item) return;
    const newQty = item.quantity - 1;
    if (newQty < 1) return; // Không giảm dưới 1

    try {
      await axios.put(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
          quantity: newQty,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Lỗi giảm số lượng", error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/items/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Lỗi xoá sản phẩm", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item: any) => sum + item.product_id.price * item.quantity,
    0
  );

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={fetchCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-md p-8">
        <div className="flex items-center justify-center mb-10">
          <ShoppingCart className="text-purple-700 w-8 h-8 mr-3" />
          <h1 className="text-3xl font-extrabold text-purple-700">Giỏ Hàng</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600 text-sm uppercase">
                  <th className="p-3 w-[15%]">Ảnh sản phẩm</th>
                  <th className="p-3 text-center w-[15%]">Tên sản phẩm</th>
                  <th className="p-3 text-center">Giá</th>
                  <th className="p-3 text-center w-[15%]">Số lượng</th>
                  <th className="p-3 text-center w-[10%]">Tổng</th>
                  <th className="p-3 text-center w-[10%]">Xóa</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item: any) => {
                  const product = item.product_id;
                  const id = product._id;

                  return (
                    <tr key={id} className="border-b hover:bg-gray-50">
                      {/* Ảnh */}
                      <td className="p-3 flex ">
                        <img
                          src={product.images?.[0]}
                          className="w-16 h-16 rounded-xl object-cover"
                          alt={product.name}
                        />
                      </td>

                      {/* Tên */}
                      <td className="p-3 text-center font-semibold">
                        {product.name}
                      </td>

                      {/* Giá */}
                      <td className="p-3 text-center text-purple-700 font-semibold">
                        {product.price.toLocaleString()} đ
                      </td>

                      {/* Số lượng */}
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center space-x-2 w-max mx-auto px-2 py-1 rounded">
                          <button
                            onClick={() => decreaseQuantity(id)}
                            className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(id)}
                            className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Tổng */}
                      <td className="p-3 text-center font-semibold">
                        {(product.price * item.quantity).toLocaleString()} đ
                      </td>

                      {/* Xóa */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeItem(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

                <button className="bg-purple-600 text-white w-full py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition">
                  Thanh Toán
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
