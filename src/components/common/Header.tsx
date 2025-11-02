import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  // Cập nhật user khi load hoặc khi sự kiện login diễn ra
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("userLogin", loadUser);

    return () => {
      window.removeEventListener("userLogin", loadUser);
    };
  }, []);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };

  return (
    <div className="text-sm font-sans">
      <div className="flex items-center justify-between px-6 py-2 border-b bg-white">
        <div className="flex items-center space-x-3">
          <Link to="/" className="font-bold text-lg text-gray-800">
            B-<span className="text-purple-600">World</span>
          </Link>
          <span className="text-gray-400">We love books</span>
        </div>

        <div className="flex items-center space-x-3">
          <form className="relative w-64" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="rounded-md text-sm w-full outline-none focus:ring-2 focus:ring-purple-300 pr-10 bg-white border border-gray-300 py-2 px-3"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition"
            >
              <i className="fas fa-search text-base"></i>
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-6 text-gray-600 relative">
          <a href="#" className="hover:text-purple-600">Privacy policy</a>
          <a href="#" className="hover:text-purple-600">Warranty</a>
          <a href="#" className="hover:text-purple-600">Shipping</a>
          <a href="#" className="hover:text-purple-600">Returns</a>
          <Link to="/cart" className="hover:text-purple-700 text-purple-600 text-xl transition">
            <i className="fas fa-shopping-cart"></i>
          </Link>
          <span className="mx-2 text-gray-300">|</span>
          <a href="#" className="hover:text-purple-700 text-purple-600 text-xl transition">
            <i className="fas fa-heart"></i>
          </a>
          <span className="mx-2 text-gray-300">|</span>

          {/* USER MENU */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setOpenUserMenu((prev) => !prev)}
              className="hover:text-purple-700 text-purple-600 text-xl transition cursor-pointer"
            >
              <i className="fas fa-user"></i>
            </div>
            {openUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-gray-800 font-semibold">
                      Xin chào, {user.fullname || user.email}
                    </div>
                    <Link
                      to="/order"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
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

      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-purple-200 bg-white">
        <div className="flex items-center space-x-6 text-gray-700">
          <a href="#" className="hover:text-purple-600">The must read</a>
          <a href="#" className="hover:text-purple-600">News</a>
          <a href="#" className="hover:text-purple-600">Promotion of the month</a>
          <a href="#" className="hover:text-purple-600">Publishs</a>
          <a href="#" className="hover:text-purple-600">Subscribe to the newsletter</a>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-purple-600">
            <i className="fas fa-phone-alt mr-1" style={{ transform: "scaleX(-1)" }}></i>{" "}
            +445 87 999 000
          </span>
          <button className="border border-purple-600 text-purple-600 bg-white px-4 py-1 rounded hover:bg-purple-600 hover:text-white transition">
            Request a call
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
