import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await login(email, password);

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Đăng nhập thất bại!";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-lg font-semibold text-center mb-6 text-gray-700">
            Đăng nhập bằng
          </h2>
          <button className="w-full flex items-center justify-center gap-3 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 font-semibold transition shadow-md">
            <i className="fab fa-google"></i>
            Google
          </button>
        </div>

        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="px-4 text-gray-500 font-semibold">HOẶC</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Đăng nhập với Email
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center font-semibold">
              Đăng nhập thành công!
            </div>
          )}

          <div className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <span className="absolute left-4 top-11 text-gray-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <span className="absolute left-4 top-11 text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Chưa có tài khoản?
                <a
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold underline"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default LoginPage;
