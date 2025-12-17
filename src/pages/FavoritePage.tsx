import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./Auth/LoginModal";
import { API_BASE_URL } from "../configs/api";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  author: string;
  namxuatban: number;
  nhaxuatban: string;
  sotrang: number;
  slug: string;
  description: string;
  images: string[];
  category?: Category;
  weight: number;
  size: string;
  sku: string;
  price: number;
  quantity: number;
}

interface FavoriteItem {
  _id: string;
  product: Product;
  createdAt: string;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      setLoading(false);
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(" Favorites API:", response.data);

      setFavorites(response.data);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách yêu thích:", error.response?.data);
      showNotification("Không thể tải danh sách yêu thích", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/me/favorite/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFavorites(favorites.filter((item) => item.product?._id !== productId));
      showNotification("Đã xóa khỏi danh sách yêu thích", "success");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
      showNotification("Không thể xóa sản phẩm", "error");
    }
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const getProductImage = (p: Product | null | undefined) => {
    if (!p)
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
    return p.images && p.images.length > 0
      ? p.images[0]
      : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            navigate("/");
          }}
        />
        <div className="text-center p-8">
          <i className="fas fa-heart text-gray-300 text-9xl mb-6"></i>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đăng nhập để xem danh sách yêu thích
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để quản lý sản phẩm yêu thích của mình
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">
            Đang tải danh sách yêu thích...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <i className="fas fa-check-circle text-xl"></i>
            <span className="font-semibold">Đã thêm vào giỏ hàng!</span>
          </div>
        </div>
      )}

      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <i
              className={`fas ${
                notification.type === "success"
                  ? "fa-check-circle"
                  : "fa-exclamation-circle"
              } text-xl`}
            ></i>
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                <i className="fas fa-heart text-red-500 mr-3"></i>
                Sản phẩm yêu thích
              </h1>
              <p className="text-gray-600">
                Bạn có{" "}
                <span className="font-bold text-purple-600">
                  {favorites.length}
                </span>{" "}
                sản phẩm trong danh sách yêu thích
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              <i className="fas fa-shopping-bag"></i>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <i className="fas fa-heart-broken text-gray-300 text-9xl mb-6"></i>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Danh sách yêu thích trống
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm những
              cuốn sách yêu thích của bạn!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
            >
              <i className="fas fa-search mr-2"></i>
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => {
              // Safety check
              if (!item.product) return null;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => handleProductClick(item.product._id)}
                  >
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.name || "Product"}
                      className="w-full h-80 object-cover group-hover:opacity-90 transition"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect width="300" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {/* Remove Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(item.product._id);
                      }}
                      className="absolute top-3 left-3 bg-white text-red-500 p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                      <i className="fas fa-heart text-xl"></i>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Category */}
                    {item.product.category && (
                      <div className="mb-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {item.product.category.name}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 cursor-pointer text-lg"
                      onClick={() => handleProductClick(item.product._id)}
                    >
                      {item.product.name || "Không có tên"}
                    </h3>

                    {/* Author */}
                    <p className="text-sm text-gray-600 mb-1">
                      {item.product.author || "Không rõ tác giả"}
                    </p>

                    {/* Publisher & Year */}
                    <p className="text-xs text-gray-500 mb-3">
                      {item.product.nhaxuatban || "N/A"} •{" "}
                      {item.product.namxuatban || "N/A"}
                    </p>

                    <div className="mb-3">
                      <span className="text-sm text-gray-500 italic">
                        Vui lòng chọn loại bìa để xem giá
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {item.product.quantity > 0 ? (
                        <span className="text-sm text-green-600 flex items-center">
                          <i className="fas fa-check-circle mr-1"></i>
                          Còn {item.product.quantity} sản phẩm
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 flex items-center">
                          <i className="fas fa-times-circle mr-1"></i>
                          Hết hàng
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="mb-4 text-xs text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <i className="fas fa-book-open w-4 mr-2"></i>
                        <span>{item.product.sotrang || 0} trang</span>
                      </div>
                      {item.product.size && (
                        <div className="flex items-center">
                          <i className="fas fa-ruler-combined w-4 mr-2"></i>
                          <span>{item.product.size}</span>
                        </div>
                      )}
                      {item.product.weight > 0 && (
                        <div className="flex items-center">
                          <i className="fas fa-weight w-4 mr-2"></i>
                          <span>{item.product.weight}g</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(item.product._id)}
                        className="flex-1 py-2.5 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        Xem chi tiết & mua
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(item.product._id)}
                        className="px-4 py-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                        title="Xóa khỏi yêu thích"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Section */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <i className="fas fa-heart text-red-500 text-4xl mb-3"></i>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {favorites.length}
                </h3>
                <p className="text-gray-600">Sản phẩm yêu thích</p>
              </div>
              <div>
                <i className="fas fa-book text-purple-600 text-4xl mb-3"></i>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {favorites.reduce(
                    (total, item) => total + (item.product?.quantity || 0),
                    0
                  )}
                </h3>
                <p className="text-gray-600">Tổng số lượng có sẵn</p>
              </div>
              <div>
                <i className="fas fa-money-bill-wave text-green-600 text-4xl mb-3"></i>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {favorites
                    .reduce(
                      (total, item) => total + (item.product?.price || 0),
                      0
                    )
                    .toLocaleString("vi-VN")}
                  ₫
                </h3>
                <p className="text-gray-600">Tổng giá trị</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
