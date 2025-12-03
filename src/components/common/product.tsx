import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../../pages/Auth/LoginModal";

type Book = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  author: string;
  price: number | string;
  images: string[];
  category?: string;
  description?: string;
};

const API_BASE_URL = "http://localhost:5004/api";

const BookCard = ({
  book,
  onAddToCart,
}: {
  book: Book;
  onAddToCart: (book: Book) => void;
}) => {
  const navigate = useNavigate();

  const formatPrice = (price: number | string) => {
    const numPrice =
      typeof price === "string" ? parseFloat(price.replace(/\./g, "")) : price;
    return new Intl.NumberFormat("vi-VN").format(numPrice);
  };

  const getBookName = () => book.title || book.name || "Sản phẩm";
  const getBookId = () => book._id || book.id;

  const getImageUrl = () => {
    if (book.images && book.images.length > 0) {
      return book.images[0].startsWith("http")
        ? book.images[0]
        : `${API_BASE_URL}/${book.images[0]}`;
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  const handleCardClick = () => {
    const id = getBookId();
    if (id) {
      navigate(`/products/${id}`);
      window.scrollTo(0, 0);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(book);
  };

  return (
    <div
      className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={getImageUrl()}
        alt={getBookName()}
        className="h-60 w-full object-cover rounded mb-4"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
        }}
      />
      <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
        {getBookName()}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
      <p className="font-bold text-red-500 mb-3">{formatPrice(book.price)} đ</p>
      <button
        onClick={handleAddToCartClick}
        className="bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 px-3 rounded mt-auto transition-colors duration-200"
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

const BookCarousel: React.FC = () => {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [mustBuyBooks, setMustBuyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingBook, setPendingBook] = useState<Book | null>(null);

  const { isAuthenticated, user, token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products?limit=8`);
        const data = await res.json();

        let products: Book[] = [];
        if (Array.isArray(data)) products = data;
        else if (data.data && Array.isArray(data.data)) products = data.data;
        else if (data.data && data.data.items && Array.isArray(data.data.items))
          products = data.data.items;
        else if (data.items && Array.isArray(data.items)) products = data.items;

        setSelectedBooks(products.slice(0, 4));
        setMustBuyBooks(products.slice(4, 8));
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      setPendingBook(book);
      setShowLoginModal(true);
      return;
    }
    addToCartHandler(book);
  };
  const addToCartHandler = async (book: Book) => {
    try {
      if (!isAuthenticated) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: book._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `Thêm vào giỏ hàng thất bại: ${response.status} - ${errText}`
        );
      }

      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (pendingBook) {
      addToCartHandler(pendingBook);
      setPendingBook(null);
    }
  };

  if (loading)
    return <div className="p-10 text-center text-xl">Đang tải sản phẩm...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="space-y-10">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {showCartNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Đã thêm vào giỏ hàng!</span>
          </div>
        </div>
      )}

      <section className="bg-white py-12 px-4 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 md:text-left">
            <span className="inline-block border border-purple-300 text-purple-500 text-xs px-3 py-1 rounded-full">
              Truyện Doraemon mới nhất
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Fujiko F. Fujio
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Doraemon, được sáng tạo bởi Fujiko F. Fujio, là một trong những bộ
              manga nổi tiếng nhất mọi thời đại...
            </p>

            <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-6 py-3 rounded transition-colors duration-200 shadow-md hover:shadow-lg">
              Đặt trước ngay
            </button>
          </div>

          <div className="text-center md:text-right relative group">
            <div className="absolute -top-6 right-4 z-10 bg-red-500 text-white px-6 py-2 rounded-full transform -rotate-2 shadow-lg animate-bounce">
              <span className="text-sm font-bold whitespace-nowrap">
                GIẢM GIÁ 30%
              </span>
            </div>
            <div className="relative overflow-hidden rounded-lg mt-8">
              <img
                src="https://masterihomes.com.vn/wp-content/uploads/2025/08/sach-doraemon-hoat-hinh-mau-nobita-va-vien-bao-tang-bao-boi-pdf.png"
                alt="Doraemon"
                className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto md:mx-0 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300.png?text=No+Banner";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span className="text-white font-semibold">
                    Sách có chữ ký tác giả
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Lựa chọn cho bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {selectedBooks.map((book, idx) => (
            <BookCard
              key={book._id || book.id || idx}
              book={book}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Có thể mua ngay</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {mustBuyBooks.map((book, idx) => (
            <BookCard
              key={book._id || book.id || idx}
              book={book}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookCarousel;
