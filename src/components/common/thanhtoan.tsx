import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";
import { useLocation } from "react-router-dom";

function Thanhtoan() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
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

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      navigate("/cart");
      return;
    }

    // Sử dụng selectedItems
    setCartItems(selectedItems);
    fetchUserInfo();
  }, [isAuthenticated, navigate]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Tính tổng tiền
  const total = cartItems.reduce((sum, item) => {
    if (!item.product_id) return sum;
    const price = item.variant_id?.price ?? item.product_id?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const phiShip = 30000;

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

    // Kiểm tra số lượng tồn kho trước khi đặt hàng
    const invalidItems = cartItems.filter((item) => {
      if (!item.product_id) return false;
      const availableQty =
        item.variant_id?.quantity ?? item.product_id?.quantity ?? 0;
      return item.quantity > availableQty;
    });

    if (invalidItems.length > 0) {
      const itemNames = invalidItems
        .map((item) => {
          const variantInfo = item.variant_id
            ? ` (${item.variant_id.type})`
            : "";
          const availableQty =
            item.variant_id?.quantity ?? item.product_id?.quantity ?? 0;
          return `- ${item.product_id.name}${variantInfo}: Bạn đặt ${item.quantity}, chỉ còn ${availableQty}`;
        })
        .join("\n");

      alert(
        `Các sản phẩm sau không đủ số lượng:\n\n${itemNames}\n\nVui lòng giảm số lượng hoặc xóa khỏi giỏ hàng!`
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        shipping_address: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.addressDetail,
        },
        payment: {
          method: paymentMethod,
          status: "Chưa thanh toán",
        },
        items: cartItems
          .filter((item) => item.product_id) // Lọc item hợp lệ
          .map((item: any) => ({
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

      console.log("📦 Đang gửi đơn hàng:", orderData);
      console.log("🌐 API URL:", `${API_BASE_URL}/orders`);
      console.log("🔑 Token:", token ? "Có" : "Không có");

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Response từ server:", response.data);

      if (response.data.success) {
        alert("Đặt hàng thành công!");

        // Xóa sản phẩm đã đặt khỏi giỏ hàng
        try {
          await axios.post(
            `${API_BASE_URL}/cart/items/clear-selected`,
            {
              items: cartItems
                .filter((item) => item.product_id)
                .map((item: any) => ({
                  product_id: item.product_id._id,
                  variant_id: item.variant_id?._id || null,
                })),
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("🗑️ Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (err: any) {
          console.log(
            "⚠️ Không thể xóa giỏ hàng:",
            err.response?.data || err.message
          );
        }

        // Chuyển đến trang đơn hàng
        navigate("/order");
      } else {
        alert(
          "Đặt hàng thất bại: " +
            (response.data.message || "Lỗi không xác định")
        );
      }
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });

      let errorMsg = "Đặt hàng thất bại. Vui lòng thử lại!";

      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        errorMsg =
          "Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.";
      } else if (error.response?.status === 401) {
        errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        localStorage.removeItem("token");
        navigate("/login");
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("không đủ số lượng")
      ) {
        errorMsg =
          error.response.data.message +
          "\n\nVui lòng quay lại giỏ hàng và giảm số lượng!";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      alert(errorMsg);
    } finally {
      setLoading(false);
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
        onLoginSuccess={() => {}}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* FORM THÔNG TIN */}
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
              disabled={loading}
              className={`w-full p-4 rounded-lg font-bold transition mt-6 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {loading ? "Đang xử lý..." : "Xác Nhận Đặt Hàng"}
            </button>
          </div>

          {/* THÔNG TIN ĐƠN HÀNG */}
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
                  if (!product) return null;

                  const variant = item.variant_id;
                  const key = product._id + (variant?._id || "");
                  const price = variant?.price ?? product.price ?? 0;
                  const totalPrice = price * item.quantity;

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 mb-6 border-b pb-4"
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/60"
                        }
                        className="w-16 h-16 object-cover rounded-lg"
                        alt={product.name}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>

                        {variant && (
                          <p className="text-sm text-gray-700">
                            Loại bìa:{" "}
                            <span className="font-medium">{variant.type}</span>
                          </p>
                        )}

                        <p className="text-sm text-gray-600">
                          Số lượng:{" "}
                          <span className="font-medium">x{item.quantity}</span>
                        </p>

                        <p className="text-sm text-gray-600">
                          Đơn giá:{" "}
                          <span className="font-medium">
                            {price.toLocaleString()}đ
                          </span>
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
