import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    country: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng Ký Tài Khoản</h1>
          <p className="text-gray-600">Tạo tài khoản mới để bắt đầu mua sắm</p>
        </div>

        {/* Social Register */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-center mb-6">Đăng ký nhanh với</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-semibold transition shadow-md">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
            <button className="flex items-center justify-center gap-3 bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 font-semibold transition shadow-md">
              <i className="fab fa-google"></i>
              Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-900 font-semibold transition shadow-md">
              <i className="fab fa-apple"></i>
              Apple
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-8">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="px-4 text-gray-500 font-semibold">HOẶC</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng ký bằng email</h2>
          
          <div className="space-y-5">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nhập họ của bạn"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nhập tên của bạn"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-phone"></i>
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Address */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <span className="absolute left-4 top-11 text-gray-400">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <input
                type="text"
                name="address"
                placeholder="Số nhà, tên đường"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-city"></i>
                </span>
                <input
                  type="text"
                  name="city"
                  placeholder="Hà Nội, TP.HCM..."
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quốc gia
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-globe"></i>
                </span>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Chọn quốc gia</option>
                  <option value="vn">Việt Nam</option>
                  <option value="us">United States</option>
                  <option value="jp">Japan</option>
                  <option value="kr">Korea</option>
                </select>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3 pt-4">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-purple-600 text-white py-4 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg text-lg">
              Đăng Ký Ngay
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <a href="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                  Đăng nhập ngay
                </a>
              </p>
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

export default RegisterPage;