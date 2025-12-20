import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await login(email, password);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Toast Notification */}
      {success && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            backgroundColor: "#10b981",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 99999,
            animation: "slideIn 0.4s ease-out",
            maxWidth: "420px",
            minWidth: "320px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "24px", height: "24px", flexShrink: 0 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: "700",
                marginBottom: "0.25rem",
                fontSize: "1rem",
              }}
            >
              Đăng nhập thành công!
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.95 }}>
              Chào mừng bạn quay trở lại...
            </p>
          </div>
        </div>
      )}

      {/* Error Toast Notification */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 99999,
            animation: "slideIn 0.4s ease-out",
            maxWidth: "420px",
            minWidth: "320px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "24px", height: "24px", flexShrink: 0 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontWeight: "700",
                marginBottom: "0.25rem",
                fontSize: "1rem",
              }}
            >
              Đăng nhập thất bại!
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.95 }}>{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "0.5rem",
              padding: "0.25rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              border: "none",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.3)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.2)")
            }
          >
            <svg
              style={{ width: "18px", height: "18px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fadeIn">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Đăng Nhập
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Bạn cần đăng nhập để tiếp tục
          </p>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

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

      {/* Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default LoginModal;
