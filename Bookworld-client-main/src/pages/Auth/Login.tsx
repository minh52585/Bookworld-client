import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // AuthContext login() sẽ trả về user + token
      const res = await login(email, password);

      // Lưu token + user vào localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Đăng nhập thất bại!";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đăng Nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Social Login */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-lg font-semibold text-center mb-6 text-gray-700">
            Đăng nhập bằng
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold transition shadow-md">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 font-semibold transition shadow-md">
              <i className="fab fa-google"></i>
              Google
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="px-4 text-gray-500 font-semibold">HOẶC</span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Đăng nhập với Email
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <a href="/register" className="text-purple-600 underline">
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
