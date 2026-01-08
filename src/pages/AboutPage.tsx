import React from "react";
import {
  BookOpen,
  Heart,
  Package,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-orange-100 text-orange-700 px-6 py-2 rounded-full text-sm font-semibold">
              Về Chúng Tôi
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            B.World Bookstore
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Thế giới sách online - Nơi tri thức được kết nối, lan tỏa và chia sẻ
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Câu Chuyện Của Chúng Tôi
            </h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            B.World Bookstore được sinh ra từ niềm đam mê với sách và khát khao
            lan tỏa tri thức đến mọi người. Chúng tôi tin rằng mỗi cuốn sách là
            một cánh cửa mở ra những thế giới mới, những kiến thức bổ ích và
            những trải nghiệm đáng nhớ.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Với kho sách đa dạng từ văn học, kinh tế, kỹ năng sống đến sách
            thiếu nhi, chúng tôi mong muốn trở thành người bạn đồng hành đáng
            tin cậy trong hành trình khám phá tri thức của bạn. Mỗi cuốn sách
            được chọn lọc kỹ lưỡng, đảm bảo chất lượng nội dung và in ấn.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Tại B.World Bookstore, chúng tôi không chỉ bán sách mà còn xây dựng
            một cộng đồng yêu sách, nơi mọi người có thể tìm thấy nguồn cảm
            hứng, học hỏi và phát triển bản thân mỗi ngày.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Đa Dạng</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Kho sách phong phú với hàng nghìn đầu sách từ nhiều thể loại khác
              nhau, phục vụ mọi nhu cầu đọc của bạn.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Uy Tín</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Cam kết sách chính hãng 100%, nguồn gốc rõ ràng, đảm bảo quyền lợi
              của khách hàng và tác giả.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Giao Hàng</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Giao hàng nhanh chóng toàn quốc, đóng gói cẩn thận để sách đến tay
              bạn trong tình trạng hoàn hảo.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tận Tâm</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Đội ngũ tư vấn nhiệt tình, am hiểu sách, luôn sẵn sàng gợi ý những
              cuốn sách phù hợp với bạn.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Giá Tốt</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Giá cả cạnh tranh, nhiều chương trình khuyến mãi hấp dẫn, giúp bạn
              tiết kiệm khi mua sách.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Cộng Đồng</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Xây dựng cộng đồng người yêu sách, nơi chia sẻ cảm nhận, review và
              gợi ý sách hay cho nhau.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Bắt Đầu Hành Trình Khám Phá
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/95">
            Mỗi cuốn sách là một hành trình mới. Hãy để chúng tôi đồng hành cùng
            bạn trong việc tìm kiếm và khám phá những cuốn sách tuyệt vời!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Hotline: 0372572892
            </a>
            <a
              href="#"
              className="bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-800 transition-all duration-300 hover:scale-105 shadow-lg border-2 border-white"
            >
              Email: b.world@store.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
