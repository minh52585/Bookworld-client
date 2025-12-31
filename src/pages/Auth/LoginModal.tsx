import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { showNotification } from "../../utils/notification";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showNotification(
        "Đăng nhập thành công! Chào mừng bạn quay trở lại...",
        "success"
      );

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Đăng nhập thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Toast Notification */}

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Đăng Nhập
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Bạn cần đăng nhập để tiếp tục
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-700 underline font-semibold"
              onClick={onClose}
            >
              Đăng ký ngay
            </Link>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-600 hover:text-gray-800"
          >
            Hủy
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
