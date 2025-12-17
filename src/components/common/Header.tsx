import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../configs/api";

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  let searchTimeout: any;
  // danh muc
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

  //search
  // ====================================================
  // SEARCH REALTIME — DÙNG CLIENT-SIDE GIỐNG SEARCHPAGE
  // ====================================================
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const fetchSearch = async (text: string) => {
    clearTimeout(searchTimeout);
    setSearchText(text);

    if (!text.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);

    searchTimeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        const all = res.data?.data || [];
        const q = removeVietnameseTones(text.toLowerCase().trim());
        const filtered = all.filter((p: any) =>
          removeVietnameseTones(p.title.toLowerCase()).includes(q)
        );

        setSearchResults(filtered);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search realtime error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    nav(`/search?query=${searchText}`);
    setShowDropdown(false);
  };
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      nav("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="text-sm font-sans">
      {/* header*/}
      <div className="flex items-center justify-between px-6 py-2 border-b bg-white">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-bold text-lg text-gray-800">
            B-<span className="text-purple-600">World</span>
          </Link>
          <span className="text-gray-400">Chúng tôi yêu sách</span>
        </div>

        {/* search */}
        <form className="relative w-64" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={searchText}
            onChange={(e) => fetchSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            className="rounded-md text-sm w-full outline-none focus:ring-2
              focus:ring-purple-300 pr-10 bg-white border border-gray-300 py-2 px-3"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 animate-spin rounded-full"></div>
            ) : (
              <i className="fas fa-search text-gray-600"></i>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-50 mt-2 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    className="p-2 hover:bg-purple-100 cursor-pointer flex gap-2"
                    onClick={() => {
                      // Fix đúng route sản phẩm
                      nav(`/products/${item._id}`);
                      setShowDropdown(false);
                    }}
                  >
                    <img
                      src={item.image || "/no-image.png"}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-red-600 font-semibold text-sm">
                        {item.price}₫
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-sm">
                  Không tìm thấy sản phẩm
                </div>
              )}
            </div>
          )}
        </form>

        {/* right menu */}
        <div className="flex items-center space-x-6 text-gray-600 relative">
          <a href="#" className="hover:text-purple-600">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-purple-600">
            Bảo hành
          </a>
          <a href="#" className="hover:text-purple-600">
            Vận chuyển
          </a>
          <a href="#" className="hover:text-purple-600">
            Trả hàng
          </a>

          <Link
            to="/cart"
            className="text-purple-600 text-xl hover:text-purple-700"
          >
            <i className="fas fa-shopping-cart"></i>
          </Link>

          <a
            href="/favorite"
            className="text-purple-600 text-xl hover:text-purple-700"
          >
            <i className="fas fa-heart"></i>
          </a>
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">
                  Xin chào,{" "}
                  <b className="text-purple-700">{user?.name || user?.email}</b>
                </span>

                {user?.role === "admin" && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    ADMIN
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setOpenUserMenu((prev) => !prev)}
                  className="text-purple-600 text-xl cursor-pointer hover:text-purple-700"
                >
                  <i className="fas fa-user"></i>
                </div>

                {openUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded z-50">
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-purple-200 bg-white">
        <div className="flex items-center space-x-6 text-gray-700">
          <div className="relative group">
            <span className="hover:text-purple-600 cursor-pointer">
              Sách nên đọc
            </span>

            <div
              className="absolute left-0 mt-3 w-56 bg-purple-800 text-white rounded-lg 
              shadow-2xl p-3 opacity-0 invisible 
              group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              {categories.map((cate) => (
                <Link
                  key={cate._id}
                  to={`/categories/${cate._id}`}
                  className="block px-3 py-2 rounded text-sm hover:bg-purple-600 hover:text-yellow-300"
                >
                  {cate.name}
                </Link>
              ))}
            </div>
          </div>

          <a href="#" className="hover:text-purple-600">
            Tin tức
          </a>
          <a href="#" className="hover:text-purple-600">
            Khuyến mãi tháng
          </a>
          <a href="#" className="hover:text-purple-600">
            Nhà xuất bản
          </a>
          <a href="#" className="hover:text-purple-600">
            Đăng ký nhận tin
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-purple-600">
            <i
              className="fas fa-phone-alt mr-1"
              style={{ transform: "scaleX(-1)" }}
            />
            +84 445 87 999 000
          </span>

          <button className="border border-purple-600 text-purple-600 px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition">
            Yêu cầu gọi lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
