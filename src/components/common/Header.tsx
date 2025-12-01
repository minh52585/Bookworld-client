import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  /* ====================== LOAD USER ====================== */
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("userLogin", loadUser);

    return () => window.removeEventListener("userLogin", loadUser);
  }, []);

  /* ====================== LOAD CATEGORY FROM API ====================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5004/api";
        const res = await axios.get(`${API_BASE_URL}/categories`);

        const items = res.data?.data?.items || [];

        // fallback nếu API trả về rỗng
        if (items.length === 0) {
          setCategories([
            { _id: "1", name: "Tiểu thuyết" },
            { _id: "2", name: "Trinh thám" },
            { _id: "3", name: "Hài hước" },
            { _id: "4", name: "Hoạt hình" },
            { _id: "5", name: "Cuộc sống" },
          ]);
        } else {
          setCategories(items);
        }
      } catch (err) {
        console.error("API lỗi — fallback sang danh mục local.", err);

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

  /* ====================== LOGOUT ====================== */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };

  /* ====================== JSX ====================== */
  return (
    <div className="text-sm font-sans">
      {/* ================= TOP HEADER ================= */}
      <div className="flex items-center justify-between px-6 py-2 border-b bg-white">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-bold text-lg text-gray-800">
            B-<span className="text-purple-600">World</span>
          </Link>
          <span className="text-gray-400">We love books</span>
        </div>

        {/* SEARCH */}
        <form className="relative w-64" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            className="rounded-md text-sm w-full outline-none focus:ring-2
focus:ring-purple-300 pr-10 bg-white border border-gray-300 py-2 px-3"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 
              bg-purple-600 rounded-full text-white hover:bg-purple-700 
              transition flex items-center justify-center"
          >
            <i className="fas fa-search text-base"></i>
          </button>
        </form>

        {/* RIGHT MENU */}
        <div className="flex items-center space-x-6 text-gray-600 relative">
          <a href="#" className="hover:text-purple-600">
            Privacy policy
          </a>
          <a href="#" className="hover:text-purple-600">
            Warranty
          </a>
          <a href="#" className="hover:text-purple-600">
            Shipping
          </a>
          <a href="#" className="hover:text-purple-600">
            Returns
          </a>

          <Link
            to="/cart"
            className="hover:text-purple-700 text-purple-600 text-xl transition"
          >
            <i className="fas fa-shopping-cart"></i>
          </Link>

          <a
            href="#"
            className="hover:text-purple-700 text-purple-600 text-xl transition"
          >
            <i className="fas fa-heart"></i>
          </a>

          {/* USER DROPDOWN */}
          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => setOpenUserMenu((prev) => !prev)}
              className="hover:text-purple-700 text-purple-600 text-xl cursor-pointer"
            >
              <i className="fas fa-user"></i>
            </div>

            {openUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 font-semibold">
                      Xin chào, {user.fullname || user.email}
                    </div>
                    <Link
                      to="/order"
                      className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đơn hàng của tôi
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-700"
                    >
Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM MENU ================= */}
      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-purple-200 bg-white">
        <div className="flex items-center space-x-6 text-gray-700">
          {/* ================= MUST READ HOVER DROPDOWN ================= */}
          <div className="relative group select-none">
            <span className="hover:text-purple-600 cursor-pointer">
              The must read
            </span>

            <div
              className="
                absolute left-0 mt-3 w-56 bg-purple-800 text-white rounded-lg 
                shadow-2xl p-3 z-50 opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible 
                transition-all duration-200
              "
            >
              <div className="flex flex-col space-y-1">
                {categories.length > 0 ? (
                  categories.map((cate) => (
                    <Link
                      key={cate._id}
                      to={`/category/${cate._id}`}
                      className="block px-3 py-2 rounded text-sm 
                  hover:bg-purple-600 hover:text-yellow-300 
                  transition-all"
                    >
                      {cate.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-gray-300 text-sm px-2 py-2">
                    Không có danh mục
                  </span>
                )}
              </div>
            </div>
          </div>

          <a href="#" className="hover:text-purple-600">
            News
          </a>
          <a href="#" className="hover:text-purple-600">
            Promotion of the month
          </a>
          <a href="#" className="hover:text-purple-600">
            Publishs
          </a>
          <a href="#" className="hover:text-purple-600">
            Subscribe to the newsletter
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-purple-600">
            <i
              className="fas fa-phone-alt mr-1"
              style={{ transform: "scaleX(-1)" }}
            ></i>{" "}
            +445 87 999 000
          </span>

          <button className="border border-purple-600 text-purple-600 px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition">
            Request a call
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;