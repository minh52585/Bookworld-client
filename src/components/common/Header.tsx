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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

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
    setShowLogoutModal(false);
    logout();
    setShowLogoutSuccess(true);

    setTimeout(() => {
      setShowLogoutSuccess(false);
      nav("/");
    }, 1500);
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
    <>
      {/* Logout Success Toast */}
      {showLogoutSuccess && (
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
              Đăng xuất thành công!
            </p>
            <p style={{ fontSize: "0.875rem", opacity: 0.95 }}>
              Hẹn gặp lại bạn...
            </p>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Xác nhận đăng xuất
              </h2>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <b className="text-purple-700">
                      {user?.name || user?.email}
                    </b>
                  </span>

                  {user?.role === "admin" && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
                      ADMIN
                    </span>
                  )}

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
