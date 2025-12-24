import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
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
          <div className="flex border-b">
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
              Đơn hàng của tôi
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
            {/* Thông tin cá nhân */}
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

            {/* Cài đặt */}
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

        {/* Quick Actions */}
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

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default UserProfile;
