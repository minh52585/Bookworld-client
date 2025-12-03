import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5004/api";

function Thanhtoan() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Lấy giỏ hàng từ API
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

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  // Xử lý input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xóa sản phẩm
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item: any) => sum + item.product_id.price * item.quantity,
    0
  );
  const phiShip = 30000;


  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white shadow-lg rounded-xl p-8 lg:col-span-2">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2 mb-6">
            <ShoppingCart /> Thông Tin Giao Hàng
          </h2>

          <div className="mb-4">
            <label className="font-medium">Họ và tên *</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập email"
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Số điện thoại *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Tỉnh / Thành phố *</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn tỉnh/thành --</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium">Quận / Huyện *</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn quận/huyện --</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium">Phường / Xã *</label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn phường/xã --</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium">Địa chỉ nhận hàng *</label>
            <input
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập địa chỉ chi tiết"
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-600 mb-4">
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">
                  Thanh toán khi nhận hàng
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">
                  Chuyển khoản ngân hàng
                </span>
              </label>
            </div>
          </div>

          <button
            className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold hover:bg-purple-700 mt-4"
          >
            Xác Nhận Đặt Hàng
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">
            Thông tin đặt hàng
          </h2>
                {cartItems.map((item: any) => {
                  const product = item.product_id;
                  const id = product._id;
                      return (
                        <div
                          key={product._id || product.id}
                          className="flex items-center justify-between mb-6 border-b pb-4"
                        >
                          <img
                            src={product.image}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 px-4">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-gray-600">x{item.quantity}</p>
                            <p className="text-gray-600">Đơn giá : {(product.price).toLocaleString()}đ</p>

                            <p className="font-bold text-purple-600">
                              Tổng: {(product.price * item.quantity).toLocaleString()}đ
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(product._id || product.id)}
                            className="text-red-500"
                          >
                            <Trash />
                          </button>
                        </div>
                      );
                    })};
              <div className="flex justify-between text-gray-700 mb-3">
                <span>Tổng tiền hàng:</span>
                <span>{total.toLocaleString()}đ</span>
              </div>

              <div className="flex justify-between text-gray-700 mb-3">
                <span>Phí vận chuyển</span>
                <span>{phiShip.toLocaleString()}đ</span>
              </div>

              <div className="flex justify-between font-bold text-xl text-purple-600">
                <span>Tổng thanh toán</span>
                <span>{(total + 30000).toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
        );
    }

export default Thanhtoan;
