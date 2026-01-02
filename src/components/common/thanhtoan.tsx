import React, { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";
import { useLocation } from "react-router-dom";
import { showNotification } from "../../utils/notification";

function Thanhtoan() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedItems, setAppliedItems] = useState<any[]>([]);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // reset discount if cart items changed
    setDiscountAmount(0);
    setAppliedItems([]);
    setCouponError("");
  }, [cartItems.length]);

  const applyCouponAtCheckout = async () => {
    if (!coupon) return;

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const token = localStorage.getItem("token") || undefined;
      const items = cartItems
        .filter((item) => item.product_id)
        .map((item) => ({
          product_id: item.product_id._id,
          price: item.variant_id?.price ?? item.product_id?.price ?? 0,
          quantity: item.quantity,
        }));

      const subtotalSelected = items.reduce(
        (s, it) => s + (it.price || 0) * it.quantity,
        0
      );

      const resp = await (await import('../../apis/discounts')).validateDiscount({
        code: coupon,
        items,
        subtotal: subtotalSelected,
      }, token);

      const data = resp.data;
      if (!data || !data.valid) {
        setCouponError(data?.message || 'Mã không hợp lệ');
        setDiscountAmount(0);
        setAppliedItems([]);
      } else {
        if (data.appliedItems && Array.isArray(data.appliedItems)) {
          setAppliedItems(data.appliedItems);
          const total = data.appliedItems.reduce((s:any, a:any) => s + (a.discountAmount || 0), 0);
          setDiscountAmount(total || 0);
        } else if (data.amount !== undefined) {
          const total = data.amount || 0;
          setDiscountAmount(total);
        }
      }
    } catch (err:any) {
      setCouponError(err.response?.data?.message || 'Lỗi khi kiểm tra mã');
    } finally {
      setApplyingCoupon(false);
    }
  };
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

    if (!location.state || !location.state.selectedItems) {
      navigate("/cart", { replace: true });
      return;
    }

    if (selectedItems.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    setCartItems(selectedItems);

    // load pending discount if user applied one in Cart or Promotions
    try {
      const pending = localStorage.getItem('pending_discount');
      if (pending) {
        const p = JSON.parse(pending);
        setCoupon(p.code || '');
        setDiscountAmount(p.amount || 0);
        setAppliedItems(p.appliedItems || []);
        if (p.code) {
          // auto-validate when coming from promotions
          setTimeout(() => applyCouponAtCheckout(), 300);
        }
      }
    } catch (err) {
      console.warn('No pending discount', err);
    }

    fetchUserInfo();
    fetchWalletBalance();
  }, [isAuthenticated]);

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

  const fetchWalletBalance = async () => {
    setLoadingWallet(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setWalletBalance(response.data.data.balance || 0);
      }
    } catch (error: any) {
      console.error("Lỗi lấy số dư ví:", error);
      if (error.response?.status === 401) {
        showNotification(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
          "error"
        );
        navigate("/login");
      }
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const total = cartItems.reduce((sum, item) => {
    if (!item.product_id) return sum;
    const price = item.variant_id?.price ?? item.product_id?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const phiShip = 30000;
  const totalAmountBeforeDiscount = total + phiShip;
  const totalAmount = Math.max(0, totalAmountBeforeDiscount - discountAmount);

  const handleSubmitOrderCOD = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressDetail
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Giỏ hàng trống!", "error");
      return;
    }

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

      showNotification(
        `Các sản phẩm sau không đủ số lượng:\n\n${itemNames}\n\nVui lòng giảm số lượng hoặc xóa khỏi giỏ hàng!`,
        "error"
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        "error"
      );
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
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
          .filter((item) => item.product_id)
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
          discountCode: coupon || "",
        total: totalAmount,
        note: "",
      };

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        showNotification("Đặt hàng thành công!", "success");
        setCartItems([]);

        try {
          await axios.post(
            `${API_BASE_URL}/cart/items/clear-selected`,
            {
              items: cartItems.map((item: any) => ({
                product_id: item.product_id._id,
                variant_id: item.variant_id?._id || null,
              })),
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.warn("Không thể clear cart:", err);
        }

        navigate("/order", { replace: true });
      } else {
        showNotification(
          "Đặt hàng thất bại: " +
            (response.data.message || "Lỗi không xác định"),
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi:", error);

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
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrderWallet = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressDetail
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Giỏ hàng trống!", "error");
      return;
    }

    // Kiểm tra số dư ví
    if (walletBalance < totalAmount) {
      showNotification(
        `Số dư ví không đủ!\nSố dư hiện tại: ${walletBalance.toLocaleString()}đ\nTổng thanh toán: ${totalAmount.toLocaleString()}đ\n\nVui lòng nạp thêm tiền vào ví!`,
        "error"
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        "error"
      );
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems
          .filter((item) => item.product_id && item.variant_id)
          .map((item: any) => ({
            product_id: item.product_id._id,
            variant_id: item.variant_id._id,
            quantity: item.quantity,
            price: item.variant_id?.price ?? item.product_id.price,
          })),
        shipping_address: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.addressDetail,
        },
        subtotal: total,
        shipping_fee: phiShip,
        total: totalAmount,
        note: "",
        discountCode: "",
      };

      orderData.discountCode = coupon || "";
      orderData.discount = { code: coupon || "", amount: discountAmount || 0, appliedItems: appliedItems || [] };
      console.log("📦 Đang gửi đơn hàng thanh toán ví:", orderData);

      const response = await axios.post(
        `${API_BASE_URL}/wallet/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response từ Wallet:", response.data);

      if (response.data.success) {
        showNotification(
          "Đặt hàng và thanh toán bằng ví thành công!",
          "success"
        );

        // Cập nhật lại số dư ví
        await fetchWalletBalance();

        setCartItems([]);

        try {
          await axios.post(
            `${API_BASE_URL}/cart/items/clear-selected`,
            {
              items: cartItems.map((item: any) => ({
                product_id: item.product_id._id,
                variant_id: item.variant_id?._id || null,
              })),
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.warn("Không thể clear cart:", err);
        }

        navigate("/order", { replace: true });
      } else {
        showNotification(
          "Đặt hàng thất bại: " +
            (response.data.message || "Lỗi không xác định"),
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi Wallet:", error);

      let errorMsg = "Thanh toán ví thất bại. Vui lòng thử lại!";

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
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrderVNPay = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.addressDetail
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Giỏ hàng trống!", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        "error"
      );
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems
          .filter((item) => item.product_id && item.variant_id)
          .map((item: any) => ({
            product_id: item.product_id._id,
            variant_id: item.variant_id._id,
            quantity: item.quantity,
            price: item.variant_id?.price ?? item.product_id.price,
          })),
        shipping_address: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.addressDetail,
        },
        subtotal: total,
        shipping_fee: phiShip,
        total: totalAmount,
        note: "",
        discountCode: "",
      };

      orderData.discountCode = coupon || "";
      orderData.discount = { code: coupon || "", amount: discountAmount || 0, appliedItems: appliedItems || [] };
      console.log("📦 Đang gửi đơn hàng VNPay:", orderData);

      const response = await axios.post(
        `${API_BASE_URL}/vnpay/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response từ VNPay:", response.data);

      if (response.data.success && response.data.data.paymentUrl) {
        localStorage.setItem("pending_order_id", response.data.orderId);
        showNotification("Đang chuyển đến trang thanh toán VNPay...", "info");
        window.location.href = response.data.data.paymentUrl;
      } else {
        showNotification(
          "Tạo link thanh toán thất bại: " +
            (response.data.message || "Lỗi không xác định"),
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi VNPay:", error);

      let errorMsg = "Tạo thanh toán VNPay thất bại. Vui lòng thử lại!";

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
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = () => {
    if (paymentMethod === "vnpay") {
      handleSubmitOrderVNPay();
    } else if (paymentMethod === "wallet") {
      handleSubmitOrderWallet();
    } else {
      handleSubmitOrderCOD();
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
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-gray-700 font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-sm text-gray-500">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === "wallet"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <Wallet className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">
                      Thanh toán bằng ví điện tử
                    </p>
                    <p className="text-sm text-gray-500">
                      Sử dụng số dư trong ví của bạn
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {loadingWallet ? (
                        <span className="text-sm text-gray-500">
                          Đang tải...
                        </span>
                      ) : (
                        <>
                          <span className="text-sm text-gray-600">Số dư:</span>
                          <span
                            className={`text-sm font-bold ${
                              walletBalance >= totalAmount
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {walletBalance.toLocaleString()}đ
                          </span>
                          {walletBalance < totalAmount && (
                            <span className="text-xs text-red-500 ml-2">
                              (Không đủ số dư)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg cursor-pointer hover:border-blue-500 transition bg-blue-50">
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <img
                    src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                    alt="VNPay"
                    className="h-8"
                  />
                  <div>
                    <p className="text-gray-700 font-medium">
                      Thanh toán VNPay
                    </p>
                    <p className="text-sm text-gray-500">
                      Thanh toán trực tuyến qua cổng VNPay
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={
                loading ||
                (paymentMethod === "wallet" && walletBalance < totalAmount)
              }
              className={`w-full p-4 rounded-lg font-bold transition mt-6 ${
                loading ||
                (paymentMethod === "wallet" && walletBalance < totalAmount)
                  ? "bg-gray-400 cursor-not-allowed"
                  : paymentMethod === "vnpay"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : paymentMethod === "wallet"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {loading
                ? "Đang xử lý..."
                : paymentMethod === "vnpay"
                ? "Thanh toán VNPay"
                : paymentMethod === "wallet"
                ? walletBalance < totalAmount
                  ? "Số dư không đủ"
                  : "Thanh toán bằng ví"
                : "Xác Nhận Đặt Hàng"}
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
                          Đơn giá: {" "}
                          <span className="font-medium">
                            {(() => {
                              const match = appliedItems.find(a => String(a.product_id) === String(product._id));
                              if (match && match.discountAmount) {
                                const perItemDiscount = match.discountAmount / item.quantity;
                                const discountedPrice = Math.max(0, (price ?? 0) - perItemDiscount);
                                return (
                                  <>
                                    <span className="line-through text-gray-400 mr-2">{(price ?? 0).toLocaleString()}đ</span>
                                    <span className="text-purple-600">{Math.round(discountedPrice).toLocaleString()}đ</span>
                                  </>
                                );
                              }
                              return `${price.toLocaleString()}đ`;
                            })()}</span>
                        </p>

                        <p className="font-bold text-purple-600 text-lg">
                          Tổng: {(() => {
                            const match = appliedItems.find(a => String(a.product_id) === String(product._id));
                            if (match && match.discountAmount) {
                              return (Math.max(0, (price ?? 0) * item.quantity - (match.discountAmount || 0))).toLocaleString() + 'đ';
                            }
                            return totalPrice.toLocaleString() + 'đ';
                          })()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t pt-4 space-y-3">
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Mã giảm giá</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                      <button
                        onClick={applyCouponAtCheckout}
                        disabled={!coupon || applyingCoupon}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                          !coupon || applyingCoupon
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {applyingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-500 mt-2">{couponError}</p>
                    )}

                    {discountAmount > 0 && (
                      <div className="mt-3">
                        <div className="inline-flex items-center gap-3 bg-purple-600 text-white px-3 py-1 rounded-full">
                          <span className="font-semibold tracking-wide">{(coupon || '').toUpperCase()}</span>
                          <span className="text-sm opacity-90">- {discountAmount.toLocaleString()}đ</span>
                          <button
                            onClick={() => {
                              setCoupon('');
                              setDiscountAmount(0);
                              setAppliedItems([]);
                              setCouponError('');
                              try { localStorage.removeItem('pending_discount'); } catch(e) {}
                            }}
                            className="ml-2 text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-0.5">
                            Hủy
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Mã đã được áp dụng — bạn sẽ thấy giá đã giảm ở các sản phẩm tương ứng.</p>
                      </div>
                    )}
                  </div>

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

                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá:</span>
                    <span className="font-medium text-green-600">-{discountAmount.toLocaleString()}đ</span>
                  </div>

                  <div className="flex justify-between font-bold text-xl text-purple-600 pt-3 border-t">
                    <span>Tổng thanh toán:</span>
                    <span>{totalAmount.toLocaleString()}đ</span>
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
