import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";

import { useLocation } from "react-router-dom";



function Thanhtoan() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressDetail: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchUserInfo();
    fetchCart();
  }, [isAuthenticated]);

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const allItems = res.data.data?.items || [];

    // Convert selectedItems từ object sang key dạng string để so sánh
    const selectedKeys = selectedItems.map((s: any) =>
      s.product_id._id + (s.variant_id?._id || "null")
    );

    const filtered = allItems.filter((item: any) => {
      const key = item.product_id._id + (item.variant_id?._id || "null");
      return selectedKeys.includes(key);
    });

    setCartItems(filtered);
  } catch (err) {
    console.error("Lỗi lấy giỏ hàng:", err);
  }
  setLoading(false);
};


  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const userData = res.data.data;
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
      }));
    } catch (err) {
      console.error("Lỗi lấy thông tin người dùng:", err);
    }
  };

  // Xử lý input form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xóa sản phẩm


  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => {
  const price = item.variant_id?.price ?? item.product_id.price;
  return sum + price * item.quantity;
}, 0);

  const phiShip = 30000;

  // Xử lý đặt hàng
  const handleSubmitOrder = async () => {
    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressDetail
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    // Kiểm tra token
    const token = localStorage.getItem("token");
    console.log("Token:", token ? "Có token" : "Không có token");

    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    try {
      // Tạo đơn hàng
      const orderData = {
        shipping_address: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.addressDetail,
        },
        payment: {
          method: paymentMethod,
          status: "Chưa thanh toán"
        },
         items: cartItems.map((item: any) => ({
          product_id: item.product_id._id,
          variant_id: item.variant_id?._id || null,
          name: item.product_id.name,
          price: item.variant_id?.price ?? item.product_id.price,
          quantity: item.quantity,
          image: item.product_id.images?.[0] || "",
        })),
        subtotal: total,
        shipping_fee: phiShip,
        discount: {
          code: "",
          amount: 0,
        },
        total: total + phiShip,
        note: "",
      };

      console.log("Đang gửi đơn hàng:", orderData);
      console.log("API URL:", `${API_BASE_URL}/orders`);

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        alert("Đặt hàng thành công!");

        // Xóa giỏ hàng sau khi đặt hàng thành công
        try {
          await axios.post(
          `${API_BASE_URL}/cart/items/clear-selected`,
          {
            items: cartItems.map((item: any) => ({
              product_id: item.product_id._id,
              variant_id: item.variant_id?._id || null,
            })),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        } catch (err: any) {
          console.log("Không thể xóa giỏ hàng:", err.response?.data || err.message);
        }


        // Chuyển đến trang danh sách đơn hàng
        navigate("/order");
      } else {
            console.log(response.data.message);
        // alert(
        //   "Đặt hàng thất bại: " +
        //     (newFunction(response) || "Lỗi không xác định")
        // );
      }
    } catch (error: any) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMsg =
        error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại!";
      alert("" + errorMsg);

      // Nếu lỗi xác thực, chuyển về trang đăng nhập
      if (error.response?.status === 401) {
        console.log("Token hết hạn, chuyển về trang đăng nhập");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
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
                className="w-full p-3 mt-2 border rounded-lg bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="mb-4">
              <label className="font-medium">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Nhập email"
              />
            </div>

            <div className="mb-4">
              <label className="font-medium">Số điện thoại *</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="mb-4">
              <label className="font-medium">Địa chỉ nhận hàng *</label>
              <input
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleChange}
                className="w-full p-3 mt-2 border rounded-lg bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
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
                    Thanh toán khi nhận hàng (COD)
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
              onClick={handleSubmitOrder}
              className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold hover:bg-purple-700 transition mt-6"
            >
              Xác Nhận Đặt Hàng
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              Thông tin đặt hàng
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Giỏ hàng trống</p>
              </div>
            ) : (
              <>
                {cartItems.map((item: any) => {
                    const product = item.product_id;
                    const variant = item.variant_id;
                    const key = product._id + (variant?._id || "");
                    
                    const price = variant?.price ?? product.price;
                    const totalPrice = price * item.quantity;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 mb-6 border-b pb-4"
                      >
                        {/* ẢNH SẢN PHẨM */}
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/60"}
                          className="w-16 h-16 object-cover rounded-lg"
                          alt={product.name}
                        />

                        {/* THÔNG TIN SẢN PHẨM */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{product.name}</p>

                          {/* LOẠI BÌA (VARIANT) */}
                          {variant && (
                            <p className="text-sm text-gray-700">
                              Loại bìa: <span className="font-medium">{variant.type}</span>
                            </p>
                          )}

                          <p className="text-sm text-gray-600">
                            Số lượng: <span className="font-medium">x{item.quantity}</span>
                          </p>

                          <p className="text-sm text-gray-600">
                            Đơn giá: <span className="font-medium">{price.toLocaleString()}đ</span>
                          </p>

                          <p className="font-bold text-purple-600 text-lg">
                            Tổng: {totalPrice.toLocaleString()}đ
                          </p>
                        </div>

                      
                      </div>
                    );
                  })}



                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-medium">
                      {total.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">
                      {phiShip.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-xl text-purple-600 pt-3 border-t">
                    <span>Tổng thanh toán:</span>
                    <span>{(total + phiShip).toLocaleString()}đ</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thanhtoan;
function newFunction(response) {
  return response.data.message;
}

