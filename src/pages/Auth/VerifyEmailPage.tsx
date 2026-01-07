import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";

const VerifyEmailPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        email,
        otp,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Xác minh thất bại!";
      setError(errorMsg);
      console.error("Verify error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email,
      });

      setCountdown(60);
      setError("");
      alert("Đã gửi lại mã OTP về email của bạn!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gửi lại OTP thất bại!";
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <>
      {/* Success Toast */}
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
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
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
            }}
          >
            <svg
              style={{ width: "24px", height: "24px" }}
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
          <div>
            <p style={{ fontWeight: "700", fontSize: "1rem" }}>
              Xác minh thành công!
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.95 }}>
              Đang chuyển đến trang đăng nhập...
            </p>
          </div>
        </div>
      )}

      {/* Error Toast */}
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
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
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
            }}
          >
            <svg
              style={{ width: "24px", height: "24px" }}
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
            <p style={{ fontWeight: "700", fontSize: "1rem" }}>
              Xác minh thất bại!
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.95 }}>{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            style={{
              padding: "0.25rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              border: "none",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Xác Minh Email
            </h1>
            <p className="text-gray-600">Chúng tôi đã gửi mã OTP đến email</p>
            <p className="text-purple-600 font-semibold mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Nhập mã OTP (6 số)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength={6}
                className="w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                Mã OTP có hiệu lực trong 15 phút
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xác minh...
                </>
              ) : (
                "Xác Minh Email"
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Không nhận được mã?</p>
              <button
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="text-purple-600 hover:text-purple-700 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendLoading
                  ? "Đang gửi..."
                  : countdown > 0
                  ? `Gửi lại sau ${countdown}s`
                  : "Gửi lại mã OTP"}
              </button>
            </div>

            {/* Back to Register */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/register")}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Quay lại đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

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

export default VerifyEmailPage;
