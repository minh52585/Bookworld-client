import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../../pages/Auth/LoginModal";
import { API_BASE_URL } from "../../configs/api";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Book = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  author: string;
  price: number | string;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  displayPrice?: number;
  minPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  description?: string;
};

const BookCard = ({
  book,
}: {
  book: Book;
  onAddToCart: (book: Book) => void;
}) => {
  const navigate = useNavigate();

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
    console.log("handleCardClick fired", { id, book });

    if (id) {
      navigate(`/products/${id}`);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex-shrink-0 w-64"
      onClick={handleCardClick}
    >
      {/* Image với Category Badge */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
        <img
          src={getImageUrl()}
          alt={getBookName()}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Category Badge */}
        {book.category && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {book.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
          {getBookName()}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(book.averageRating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">
            ({book.reviewCount || 0})
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-red-600">
              {book.displayPrice || book.minPrice
                ? (book.displayPrice || book.minPrice)!.toLocaleString(
                    "vi-VN"
                  ) + "₫"
                : "Liên hệ"}
            </span>
          </div>
          <button className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

const CarouselSection = ({
  title,
  books,
  onAddToCart,
}: {
  title: string;
  books: Book[];
  onAddToCart: (book: Book) => void;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {books.map((book, idx) => (
            <BookCard
              key={book._id || book.id || idx}
              book={book}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        )}
      </div>
    </section>
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
        const res = await fetch(`${API_BASE_URL}/products?limit=12`);
        const data = await res.json();

        let products: Book[] = [];
        if (Array.isArray(data)) products = data;
        else if (data.data && Array.isArray(data.data)) products = data.data;
        else if (data.data && data.data.items && Array.isArray(data.data.items))
          products = data.data.items;
        else if (data.items && Array.isArray(data.items)) products = data.items;

        setSelectedBooks(products.slice(0, 6));
        setMustBuyBooks(products.slice(6, 12));
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

      <CarouselSection
        title="Lựa chọn cho bạn"
        books={selectedBooks}
        onAddToCart={handleAddToCart}
      />

      <CarouselSection
        title="Có thể mua ngay"
        books={mustBuyBooks}
        onAddToCart={handleAddToCart}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BookCarousel;
