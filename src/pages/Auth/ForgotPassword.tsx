import React, { useState } from "react";
import { API_BASE_URL } from "../../configs/api";

const ForgotPasswordFlow: React.FC = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cấu hình API base URL



  //Gửi OTP về email
  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      setSuccess(data.message || "Đã gửi OTP về email");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Trim và validate OTP
    const cleanOTP = otp.trim();
    
    console.log('Sending OTP verification:', { email, otp: cleanOTP });

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: cleanOTP }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP không đúng");
      }

      setResetToken(data.resetToken);
      setSuccess(data.message || "OTP hợp lệ");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      setSuccess(data.message || "Đổi mật khẩu thành công");

      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <i className="fas fa-key text-4xl text-purple-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {step === 1 && "Quên Mật Khẩu?"}
            {step === 2 && "Xác Thực OTP"}
            {step === 3 && "Đặt Lại Mật Khẩu"}
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Nhập email để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP đã gửi về email"}
            {step === 3 && "Tạo mật khẩu mới cho tài khoản"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </div>
          )}

          {/*Email */}
          {step === 1 && (
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
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendOTP()}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi Mã OTP"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <p>
                  <i className="fas fa-info-circle mr-1"></i>
                  Mã OTP có hiệu lực trong 15 phút
                </p>
              </div>
            </div>
          )}

          {/* OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Mã OTP đã được gửi tới:{" "}
                  <span className="font-semibold text-purple-600">{email}</span>
                </p>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã OTP (6 số) <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                  }}
                  onKeyPress={(e) => e.key === "Enter" && otp.length === 6 && handleVerifyOTP()}
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang xác thực...
                  </span>
                ) : (
                  "Xác Thực OTP"
                )}
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <i className="fas fa-redo mr-2"></i>
                Gửi lại mã OTP
              </button>
            </div>
          )}

          {/*New Password */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <span className="absolute left-4 top-11 text-gray-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
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
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600">
                  <i className="fas fa-times-circle mr-1"></i>
                  Mật khẩu xác nhận không khớp
                </p>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đặt Lại Mật Khẩu"
                )}
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <a
              href="/login"
              className="text-gray-600 hover:text-purple-600 font-medium inline-flex items-center gap-2 transition"
            >
              <i className="fas fa-arrow-left"></i>
              Quay lại đăng nhập
            </a>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-8 bg-purple-600"
                  : s < step
                  ? "w-6 bg-purple-400"
                  : "w-6 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Bạn cần hỗ trợ?{" "}
            <a
              href="#"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Liên hệ chúng tôi
            </a>
          </p>
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

export default ForgotPasswordFlow;