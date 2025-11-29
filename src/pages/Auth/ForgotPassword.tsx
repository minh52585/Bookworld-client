import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Gọi API gửi email reset password
    console.log('Gửi email reset mật khẩu tới:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <i className="fas fa-key text-4xl text-purple-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quên Mật Khẩu?</h1>
          <p className="text-gray-600">
            {isSubmitted 
              ? 'Kiểm tra email của bạn để đặt lại mật khẩu'
              : 'Nhập email của bạn để nhận link đặt lại mật khẩu'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!isSubmitted ? (
            <>
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-semibold transition shadow-lg"
                >
                  Gửi Link Đặt Lại Mật Khẩu
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-2">
                <i className="fas fa-check-circle text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Email đã được gửi!</h3>
              <p className="text-gray-600">
                Chúng tôi đã gửi link đặt lại mật khẩu tới email: <br />
                <span className="font-semibold text-purple-600">{email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Kiểm tra cả hộp thư spam nếu bạn không thấy email.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-purple-600 hover:text-purple-700 underline text-sm"
              >
                Gửi lại email
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <a 
              href="/login" 
              className="text-gray-600 hover:text-purple-600 font-medium inline-flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Quay lại đăng nhập
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Bạn cần hỗ trợ?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 underline">
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

export default ForgotPassword;