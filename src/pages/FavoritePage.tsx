import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./Auth/LoginModal";
import { API_BASE_URL } from "../configs/api";
import { Star } from "lucide-react";

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
  minPrice?: number;
  displayPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  quantity?: number;
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

      // Fetch category details for each product if needed
      const favoritesData = response.data;
      const favoritesWithCategory = await Promise.all(
        favoritesData.map(async (item: FavoriteItem) => {
          if (
            item.product &&
            item.product.category &&
            typeof item.product.category === "string"
          ) {
            try {
              const catRes = await axios.get(
                `${API_BASE_URL}/categories/${item.product.category}`
              );
              return {
                ...item,
                product: {
                  ...item.product,
                  category: catRes.data.data || catRes.data,
                },
              };
            } catch {
              return item;
            }
          }
          return item;
        })
      );

      setFavorites(favoritesWithCategory);
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

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
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

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
              onClick={() => navigate("/allproducts")}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              <i className="fas fa-shopping-bag"></i>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-500 text-lg mb-2">
              Danh sách yêu thích trống
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Bạn chưa có sản phẩm yêu thích nào
            </p>
            <button
              onClick={() => navigate("/allproducts")}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              <i className="fas fa-search mr-2"></i>
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold">{favorites.length}</span> sản
                phẩm
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item) => {
                if (!item.product) return null;
                const product = item.product;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
                  >
                    {/* Remove Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(product._id);
                      }}
                      className="absolute top-3 right-3 z-10 bg-white text-red-500 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
                      title="Xóa khỏi yêu thích"
                    >
                      <i className="fas fa-heart text-lg"></i>
                    </button>

                    <div onClick={() => handleProductClick(product._id)}>
                      {/* Product Image */}
                      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                        <img
                          src={
                            product.images[0] ||
                            "https://via.placeholder.com/300x400?text=No+Image"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Category Badge */}
                        {product.category && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {product.category.name}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {product.author}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.averageRating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-600">
                            {product.displayPrice ?? product.minPrice
                              ? (product.displayPrice ??
                                  product.minPrice)!.toLocaleString("vi-VN") +
                                "₫"
                              : "Liên hệ"}
                          </span>
                          <button className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
