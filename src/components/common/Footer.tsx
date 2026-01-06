import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";

const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        const items = res.data?.data?.items || [];

        setCategories(
          items.length > 0
            ? items
            : [
                { _id: "1", name: "Tiểu thuyết" },
                { _id: "2", name: "Trinh thám" },
                { _id: "3", name: "Hài hước" },
                { _id: "4", name: "Hoạt hình" },
                { _id: "5", name: "Cuộc sống" },
              ]
        );
      } catch (err) {
        console.error("Lỗi API danh mục. Dùng fallback.");
        setCategories([
          { _id: "1", name: "Tiểu thuyết" },
          { _id: "2", name: "Trinh thám" },
          { _id: "3", name: "Hài hước" },
          { _id: "4", name: "Hoạt hình" },
          { _id: "5", name: "Cuộc sống" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-purple-400 text-white py-8 px-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo và Mạng xã hội */}
        <div className="flex flex-col justify-between">
          <div className="font-bold text-xl">B-World</div>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white text-2xl">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white text-2xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white text-2xl">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((cate) => (
                <li key={cate._id}>
                  <Link
                    to={`/categories/${cate._id}`}
                    className="text-white hover:text-yellow-300 transition"
                  >
                    {cate.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 2: Danh mục từ API */}
          <div>
            <h3 className="font-bold mb-4">Sách hot</h3>
            <ul className="space-y-2">
              {categories.slice(4, 8).map((cate) => (
                <li key={cate._id}>
                  <Link
                    to={`/categories/${cate._id}`}
                    className="text-white hover:text-yellow-300 transition"
                  >
                    {cate.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* E-Books -> Tài khoản */}
          <div>
            <h3 className="font-bold mb-4">Tài khoản</h3>
            <ul className="text-white space-y-2">
              <li>
                <Link
                  to="/user-profile"
                  className="text-white hover:text-yellow-300 transition"
                >
                  Thông tin cá nhân
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="text-white hover:text-yellow-300 transition"
                >
                  Đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/favorite"
                  className="text-white hover:text-yellow-300 transition"
                >
                  Sản phẩm yêu thích
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-white hover:text-yellow-300 transition"
                >
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>
          {/* Hỗ trợ & Liên hệ */}
          <div>
            <h3 className="font-bold mb-4">Hỗ trợ & Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <i className="text-white fas fa-phone mr-2"></i> +84 445 87 999
                000
              </li>
              <li>
                <i className="text-white fas fa-clock mr-2"></i> Thứ 2 - Thứ 6,
                9 AM đến 11 PM
              </li>
              <li>
                <i className="text-white fas fa-envelope mr-2"></i>{" "}
                b.world@store.com
              </li>
            </ul>
          </div>
        </div>

        {/* Liên hệ & Thanh toán */}
        <div className="flex flex-col gap-8">
          <p className="text-white text-lg mb-4">
            Nếu bạn có thắc mắc, <br />
            có thể liên hệ với chúng tôi hoặc <br />
            chúng tôi sẽ giúp bạn.
          </p>
          <button className="border border-white text-white py-3 px-6 text-lg hover:bg-white hover:text-purple-400 transition-all duration-300 rounded bg-transparent">
            Liên hệ đến chúng tôi
          </button>
          <div className="flex space-x-4 mt-4">
            <img
              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
              alt="PayPal"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="MasterCard"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              alt="Visa"
              className="h-8"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-8 border-t border-white pt-4">
        <div className="text-sm text-center w-full">
          © All copyrights are reserved. B-World 2025.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
