import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./Auth/LoginModal";
import { API_BASE_URL } from "../configs/api";

interface Product {
  _id: string;
  name?: string;
  nhaxuatban: string;
  namxuatban: number;
  sotrang: number;
  author: string;
  description: string;
  images?: string[];
  image?: string;
  quantity?: number;
}

interface Category {
  name?: string;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<any[]>([]);
  const [category, setCategory] = useState<Category>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [lastViewed, setLastViewed] = useState<Product[]>([]);
  const [loadingLastViewed, setLoadingLastViewed] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(res.data.data.product || null);
        setVariants(res.data.data.variant || []);
        setCategory(res.data.data.category || []);
      } catch (err) {
        setError("Không tìm thấy sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  useEffect(() => {
    const getRelated = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}/related`);
        let products: Product[] = [];
        const data = res.data;
        if (Array.isArray(data)) products = data;
        else if (data.data && Array.isArray(data.data)) products = data.data;
        else if (data.data?.items && Array.isArray(data.data.items))
          products = data.data.items;
        else if (data.relatedProducts && Array.isArray(data.relatedProducts))
          products = data.relatedProducts;
        setRelatedProducts(products.slice(0, 8));
      } catch {
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    getRelated();
  }, [id]);

  useEffect(() => {
    const fetchLastViewed = async () => {
      try {
        const viewedIds = JSON.parse(
          localStorage.getItem("lastViewed") || "[]"
        );
        if (viewedIds.length > 0) {
          const promises = viewedIds.slice(0, 4).map((productId: string) =>
            axios
              .get(`${API_BASE_URL}/products/${productId}`)
              .then((res) => res.data.data)
              .catch(() => null)
          );
          const products = await Promise.all(promises);
          setLastViewed(products.filter((p) => p !== null));
        } else {
          const res = await axios.get(`${API_BASE_URL}/products?limit=4`);
          let products: Product[] = [];
          if (res.data.data?.items) products = res.data.data.items;
          else if (Array.isArray(res.data.data)) products = res.data.data;
          else if (Array.isArray(res.data)) products = res.data;
          setLastViewed(products);
        }
      } catch {
        setLastViewed([]);
      } finally {
        setLoadingLastViewed(false);
      }
    };
    fetchLastViewed();
  }, [id]);

  useEffect(() => {
    if (product && id) {
      const viewedIds = JSON.parse(localStorage.getItem("lastViewed") || "[]");
      const newViewed = [
        id,
        ...viewedIds.filter((vid: string) => vid !== id),
      ].slice(0, 10);
      localStorage.setItem("lastViewed", JSON.stringify(newViewed));
    }
  }, [product, id]);

  // Quantity handlers
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleIncrement = () => {
  if (selectedVariant?.quantity && quantity < selectedVariant.quantity) {
    setQuantity(quantity + 1);
  }
};



  // Product click handler
  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  //  handleAddToCart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!product) return;

    try {
      await axios.post(
        `${API_BASE_URL}/cart/items`,
        { 
          product_id: product._id,
          variant_id: selectedVariant._id,
          quantity: quantity
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 2000);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
    }
  };

  const getProductName = (p: Product) => p.name || "Sản phẩm";
  const getProductImage = (p: Product) =>
    p.image || p.images?.[0] || "/placeholder.jpg";

  if (loading)
    return <div className="p-10 text-center text-xl">Đang tải...</div>;
  if (error || !product)
    return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
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

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Thumbnails */}
          <div className="col-span-1">
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-md p-2 cursor-pointer hover:border-purple-600"
                  >
                    <img src={img} alt={`thumb-${index}`} className="w-full" />
                  </div>
                ))
              ) : (
                <div className="border border-gray-300 rounded-md p-2">
                  <img
                    src={getProductImage(product)}
                    alt="main"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Image */}
          <div className="col-span-5">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 relative">
              <img
                src={getProductImage(product)}
                alt={getProductName(product)}
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="col-span-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getProductName(product)}
            </h1>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Danh mục: {category.name}
            </h1>
            <p className="text-lg text-gray-700 mb-4">Tác giả: {product.author}</p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Mô tả: {product.description}
            </p>

            {product.nhaxuatban && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Nhà xuất bản:</strong> {product.nhaxuatban}
              </p>
            )}
            {product.namxuatban && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Năm xuất bản:</strong> {product.namxuatban}
              </p>
            )}
            {product.sotrang && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Số trang:</strong> {product.sotrang}
              </p>
            )}
  
    
            <div className="mb-6">
              <p className="font-semibold mb-2">Chọn loại bìa:</p>
              <div className="flex gap-3 flex-wrap items-center">
                {variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => {
                      setSelectedVariant(v);
                      // Reset quantity về 1 nếu vượt quá max của variant
                      setQuantity(prev => (v.quantity && prev > v.quantity ? v.quantity : 1));
                    }}
                    className={`px-4 py-2 border rounded-md font-medium transition
                      ${selectedVariant?._id === v._id 
                        ? "border-purple-600 text-purple-600 bg-purple-50"
                        : "border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600"
                      }`}
                  >
                    {v.type}
                  </button>
                ))}
              </div>

              {/* Giá */}
              {selectedVariant && (
                <p className="text-2xl font-bold text-red-600 mt-4 mb-2">
                  Đơn giá: {selectedVariant.price?.toLocaleString("vi-VN") ?? "0"} đ
                </p>
              )}

              {/* Số lượng tồn kho */}
              {selectedVariant?.quantity !== undefined && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Còn lại:</strong> {selectedVariant.quantity} cuốn
                </p>
              )}

              {/* Quantity selector */}
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className={`w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center
                    ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : "hover:border-purple-600"}`}
                >
                  <i className="fas fa-minus text-gray-600"></i>
                </button>

                <span className="text-xl font-semibold">{quantity}</span>

                <button
                  onClick={handleIncrement}
                  disabled={!selectedVariant || quantity >= (selectedVariant.quantity || 0)}
                  className={`w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center
                    ${!selectedVariant || quantity >= (selectedVariant.quantity || 0)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-purple-600"}`}
                >
                  <i className="fas fa-plus text-gray-600"></i>
                </button>
              </div>
            </div>


            <div className="flex space-x-4 mb-8">
             <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className={`
                  flex-1 px-8 py-3 rounded-md font-semibold 
                  ${selectedVariant 
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Thêm vào giỏ hàng
              </button>

              <button className="px-8 py-3 border border-gray-300 rounded-md hover:border-purple-600 hover:text-purple-600">
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-10 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>

        {loadingRelated ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải sản phẩm liên quan...</p>
          </div>
        ) : relatedProducts.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            Không có sản phẩm liên quan
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleProductClick(item._id)}
              >
                <img
                  src={getProductImage(item)}
                  className="h-48 w-full object-cover rounded mb-3"
                  alt={getProductName(item)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {getProductName(item)}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                <p className="text-red-500 font-bold">
                  
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Viewed Section */}
      <div className="mt-10 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Lượt xem gần đây</h2>

        {loadingLastViewed ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : lastViewed.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            Chưa có sản phẩm nào được xem gần đây
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {lastViewed.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => handleProductClick(item._id)}
              >
                <img
                  src={getProductImage(item)}
                  alt={getProductName(item)}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {getProductName(item)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-red-600">
                  
                    </span>
                    <button
                      className="text-gray-400 hover:text-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <button
                    className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAuthenticated) {
                        setShowLoginModal(true);
                      } else {
                        handleAddToCart();
                      }
                    }}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ
                    hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
