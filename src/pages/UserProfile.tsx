import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      navigate("/");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const maskCardNumber = (number: string) => {
    return number.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 **** **** $4");
  };

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  // Mock data cho demo (thay bằng API thực tế)
  const mockBalance = 5420000;
  const mockBankCards = [
    {
      id: 1,
      bankName: "Vietcombank",
      cardNumber: "9704123456789012",
      cardHolder: "NGUYEN VAN A",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      bankName: "TPBank",
      cardNumber: "9704987654321098",
      cardHolder: "NGUYEN VAN A",
      expiryDate: "08/27",
      isDefault: false,
    },
  ];
  const mockTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 1000000,
      date: "2024-12-25",
      status: "completed",
      method: "Vietcombank",
      note: "Nạp tiền vào ví",
    },
    {
      id: 2,
      type: "withdraw",
      amount: 500000,
      date: "2024-12-24",
      status: "completed",
      method: "TPBank",
      note: "Rút tiền về tài khoản",
    },
    {
      id: 3,
      type: "purchase",
      amount: 350000,
      date: "2024-12-23",
      status: "completed",
      method: "wallet",
      note: "Mua sách React Advanced",
    },
    {
      id: 4,
      type: "deposit",
      amount: 2000000,
      date: "2024-12-22",
      status: "completed",
      method: "Vietcombank",
      note: "Nạp tiền",
    },
    {
      id: 5,
      type: "purchase",
      amount: 280000,
      date: "2024-12-21",
      status: "completed",
      method: "wallet",
      note: "Mua sách JavaScript Pro",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                {user.role === "admin" && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                    ADMIN
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.name || "Người dùng"}
                </h1>
                <p className="text-gray-600 mb-1">
                  <i className="fas fa-envelope mr-2 text-purple-600"></i>
                  {user.email}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    <i className="far fa-calendar mr-1"></i>
                    Tham gia:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Balance Card - MỚI */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white min-w-[280px] shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">💰 Số dư khả dụng</span>
              </div>
              <div className="text-3xl font-bold mb-4">
                {formatCurrency(mockBalance)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <i className="fas fa-arrow-down mr-1"></i>
                  Nạp tiền
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <i className="fas fa-arrow-up mr-1"></i>
                  Rút tiền
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition shadow-md flex items-center space-x-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "wallet"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-wallet mr-2"></i>
              Ví của tôi
            </button>
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "cards"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-credit-card mr-2"></i>
              Thẻ ngân hàng
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "history"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-history mr-2"></i>
              Lịch sử
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "info"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              Thông tin cá nhân
            </button>
            <button
              onClick={() => navigate("/order")}
              className="flex-1 px-6 py-4 font-semibold transition bg-white text-gray-600 hover:bg-purple-50"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Đơn hàng
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "settings"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Cài đặt
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* TAB: Ví của tôi - MỚI */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Quản lý ví điện tử
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                    <div className="text-green-700 font-semibold mb-2">
                      <i className="fas fa-arrow-down mr-2"></i>
                      Tổng nạp
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(
                        mockTransactions
                          .filter((t) => t.type === "deposit")
                          .reduce((s, t) => s + t.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                    <div className="text-blue-700 font-semibold mb-2">
                      <i className="fas fa-arrow-up mr-2"></i>
                      Tổng rút
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(
                        mockTransactions
                          .filter((t) => t.type === "withdraw")
                          .reduce((s, t) => s + t.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="text-purple-700 font-semibold mb-2">
                      <i className="fas fa-shopping-bag mr-2"></i>
                      Tổng chi tiêu
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {formatCurrency(
                        mockTransactions
                          .filter((t) => t.type === "purchase")
                          .reduce((s, t) => s + t.amount, 0)
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl font-semibold transition shadow-lg group"
                  >
                    <i className="fas fa-arrow-down text-3xl mb-2 block group-hover:scale-110 transition"></i>
                    <div className="text-lg">Nạp tiền vào ví</div>
                    <div className="text-sm opacity-90 mt-1">
                      Tối thiểu 10,000đ
                    </div>
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl font-semibold transition shadow-lg group"
                  >
                    <i className="fas fa-arrow-up text-3xl mb-2 block group-hover:scale-110 transition"></i>
                    <div className="text-lg">Rút tiền về tài khoản</div>
                    <div className="text-sm opacity-90 mt-1">
                      Tối thiểu 50,000đ
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Thẻ ngân hàng - MỚI */}
            {activeTab === "cards" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Thẻ ngân hàng của tôi
                  </h2>
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Thêm thẻ mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockBankCards.map((card) => (
                    <div key={card.id}>
                      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 rounded-2xl shadow-2xl">
                        {card.isDefault && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                            <i className="fas fa-star mr-1"></i>
                            Mặc định
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-8">
                          <div className="text-xl font-bold">
                            {card.bankName}
                          </div>
                          <i className="fas fa-credit-card text-3xl"></i>
                        </div>
                        <div className="text-xl tracking-wider mb-4 font-mono">
                          {maskCardNumber(card.cardNumber)}
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xs opacity-70">Chủ thẻ</div>
                            <div className="font-semibold">
                              {card.cardHolder}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs opacity-70">Hết hạn</div>
                            <div className="font-semibold">
                              {card.expiryDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!card.isDefault && (
                          <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                            Đặt mặc định
                          </button>
                        )}
                        <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                          <i className="fas fa-trash mr-1"></i>
                          Xóa thẻ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Lịch sử giao dịch - MỚI */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Lịch sử giao dịch
                </h2>

                <div className="space-y-3">
                  {mockTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="bg-gray-50 hover:bg-gray-100 p-5 rounded-xl transition border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              t.type === "deposit"
                                ? "bg-green-100 text-green-600"
                                : t.type === "withdraw"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            <i
                              className={`fas ${
                                t.type === "deposit"
                                  ? "fa-arrow-down"
                                  : t.type === "withdraw"
                                  ? "fa-arrow-up"
                                  : "fa-shopping-bag"
                              } text-xl`}
                            ></i>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {t.note}
                            </div>
                            <div className="text-sm text-gray-600">
                              {t.method} •{" "}
                              {new Date(t.date).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              t.type === "deposit"
                                ? "text-green-600"
                                : t.type === "withdraw"
                                ? "text-blue-600"
                                : "text-purple-600"
                            }`}
                          >
                            {t.type === "deposit" ? "+" : "-"}
                            {formatCurrency(t.amount)}
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full inline-block ${
                              t.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {t.status === "completed"
                              ? "Hoàn thành"
                              : "Đang xử lý"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin cá nhân - GIỮ NGUYÊN */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Thông tin tài khoản
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ tên */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      <i className="fas fa-user mr-2 text-purple-600"></i>
                      Họ và tên
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {user.name || "Chưa cập nhật"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      <i className="fas fa-envelope mr-2 text-purple-600"></i>
                      Email
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  {/* Số điện thoại */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      <i className="fas fa-phone mr-2 text-purple-600"></i>
                      Số điện thoại
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {user.phone || "Chưa cập nhật"}
                    </p>
                  </div>

                  {/* Vai trò */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      <i className="fas fa-shield-alt mr-2 text-purple-600"></i>
                      Vai trò
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                    </p>
                  </div>
                </div>

                {/* Địa chỉ */}
                {user.address && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                      Địa chỉ
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {user.address.street && `${user.address.street}, `}
                      {user.address.city && `${user.address.city}, `}
                      {user.address.province || "Chưa cập nhật"}
                    </p>
                  </div>
                )}

                {/* Button chỉnh sửa */}
                <div className="flex justify-end mt-6">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md">
                    <i className="fas fa-edit mr-2"></i>
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            )}

            {/* Cài đặt - GIỮ NGUYÊN */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Cài đặt tài khoản
                </h2>

                {/* Đổi mật khẩu */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    <i className="fas fa-lock mr-2 text-purple-600"></i>
                    Đổi mật khẩu
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Để bảo mật tài khoản, bạn nên thay đổi mật khẩu định kỳ
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md">
                    Đổi mật khẩu
                  </button>
                </div>

                {/* Thông báo */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    <i className="fas fa-bell mr-2 text-purple-600"></i>
                    Thông báo
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-gray-700">
                        Nhận email về đơn hàng
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-gray-700">
                        Nhận email khuyến mãi
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">
                        Nhận thông báo sản phẩm mới
                      </span>
                    </label>
                  </div>
                </div>

                {/* Xóa tài khoản */}
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Vùng nguy hiểm
                  </h3>
                  <p className="text-red-700 mb-4">
                    Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành
                    động này không thể hoàn tác.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - GIỮ NGUYÊN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Link
            to="/cart"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Giỏ hàng
                </h3>
                <p className="text-gray-600 text-sm">Xem giỏ hàng của bạn</p>
              </div>
              <div className="text-3xl text-purple-600 group-hover:scale-110 transition">
                <i className="fas fa-shopping-cart"></i>
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mua sắm
                </h3>
                <p className="text-gray-600 text-sm">Khám phá sản phẩm</p>
              </div>
              <div className="text-3xl text-purple-600 group-hover:scale-110 transition">
                <i className="fas fa-book"></i>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Hỗ trợ
                </h3>
                <p className="text-gray-600 text-sm">Liên hệ với chúng tôi</p>
              </div>
              <div className="text-3xl text-purple-600 group-hover:scale-110 transition">
                <i className="fas fa-headset"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Nạp tiền */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-wallet mr-2 text-purple-600"></i>
                Nạp tiền vào ví
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chọn thẻ ngân hàng
              </label>
              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                {mockBankCards.map((c) => (
                  <option key={c.id}>
                    {c.bankName} - {maskCardNumber(c.cardNumber)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền nạp
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(amt.toString())}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {amt / 1000}K
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                alert(
                  `Nạp ${formatCurrency(
                    parseInt(depositAmount || "0")
                  )} thành công!`
                );
                setShowDepositModal(false);
                setDepositAmount("");
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold shadow-md"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Xác nhận nạp tiền
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Rút tiền */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-hand-holding-usd mr-2 text-blue-600"></i>
                Rút tiền về tài khoản
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg mb-6 border-2 border-purple-300">
              <div className="text-sm text-purple-700 mb-1">Số dư khả dụng</div>
              <div className="text-2xl font-bold text-purple-800">
                {formatCurrency(mockBalance)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rút về thẻ
              </label>
              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                {mockBankCards.map((c) => (
                  <option key={c.id}>
                    {c.bankName} - {maskCardNumber(c.cardNumber)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền rút
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickAmounts.slice(0, 3).map((amt) => (
                <button
                  key={amt}
                  onClick={() => setWithdrawAmount(amt.toString())}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {amt / 1000}K
                </button>
              ))}
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-info-circle mr-1"></i>
                Phí rút: 0đ | Thời gian: 1-3 ngày làm việc
              </p>
            </div>

            <button
              onClick={() => {
                alert(
                  `Rút ${formatCurrency(
                    parseInt(withdrawAmount || "0")
                  )} thành công!`
                );
                setShowWithdrawModal(false);
                setWithdrawAmount("");
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold shadow-md"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Xác nhận rút tiền
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Thêm thẻ */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-credit-card mr-2 text-purple-600"></i>
                Thêm thẻ ngân hàng
              </h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngân hàng
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option>Vietcombank</option>
                  <option>TPBank</option>
                  <option>Techcombank</option>
                  <option>VietinBank</option>
                  <option>BIDV</option>
                  <option>MB Bank</option>
                  <option>ACB</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số thẻ
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên chủ thẻ
                </label>
                <input
                  type="text"
                  placeholder="NGUYEN VAN A"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hết hạn
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Đặt làm thẻ mặc định
                </span>
              </label>
            </div>

            <button
              onClick={() => {
                alert("Thêm thẻ thành công!");
                setShowAddCardModal(false);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow-md mt-6"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Thêm thẻ
            </button>
          </div>
        </div>
      )}

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default UserProfile;
