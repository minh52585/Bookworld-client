import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Liên Hệ
          </h1>
          <p className="text-gray-600 text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-4">
          {/* Phone */}
          <a
            href="#"
            className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Điện thoại
              </h3>
              <p className="text-2xl font-bold text-purple-700">0372572892</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="#"
            className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Email
              </h3>
              <p className="text-2xl font-bold text-purple-700 break-all">
                b.world@store.com
              </p>
            </div>
          </a>

          {/* Working Hours */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 flex items-center gap-5">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Giờ làm việc
              </h3>
              <p className="text-xl font-semibold text-gray-700">
                Thứ 2 - Thứ 6: 9:00AM - 11:00PM
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Hãy liên hệ với chúng tôi qua số điện thoại hoặc email trên
          </p>
        </div>
      </div>
    </div>
  );
}
