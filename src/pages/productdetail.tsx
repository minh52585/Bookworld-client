import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  _id: string;
  name?: string;
  title?: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  totalReviews?: number;
  description: string;
  images?: string[];
  image?: string;
  stock?: number;
  publisher?: string;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [lastViewed, setLastViewed] = useState<Product[]>([]);
  const [loadingLastViewed, setLoadingLastViewed] = useState(true);

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError("Không tìm thấy sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const getRelated = async () => {
      try {
        console.log(
          "Đang gọi API related:",
          `http://localhost:5004/api/products/${id}/related`
        );
        const res = await axios.get(
          `http://localhost:5004/api/products/${id}/related`
        );

        console.log("Response từ related API:", res.data);
        console.log("Response status:", res.status);

        // Xử lý cấu trúc response
        let products: Product[] = [];
        const data = res.data;

        console.log("Kiểm tra cấu trúc data:", {
          isArray: Array.isArray(data),
          hasData: !!data.data,
          hasDataItems: !!(data.data && data.data.items),
          keys: Object.keys(data),
        });

        if (Array.isArray(data)) {
          products = data;
          console.log(
            "✓ Data là Array trực tiếp, có",
            products.length,
            "sản phẩm"
          );
        } else if (data.data && Array.isArray(data.data)) {
          products = data.data;
          console.log('✓ Data có key "data", có', products.length, "sản phẩm");
        } else if (
          data.data &&
          data.data.items &&
          Array.isArray(data.data.items)
        ) {
          products = data.data.items;
          console.log(
            "✓ Data có cấu trúc data.items, có",
            products.length,
            "sản phẩm"
          );
        } else if (
          data.relatedProducts &&
          Array.isArray(data.relatedProducts)
        ) {
          products = data.relatedProducts;
          console.log(
            '✓ Data có key "relatedProducts", có',
            products.length,
            "sản phẩm"
          );
        } else {
          console.error("Không tìm thấy array sản phẩm trong response");
        }

        console.log("Tổng số sản phẩm related:", products.length);
        setRelatedProducts(products.slice(0, 8)); // Lấy tối đa 8 sản phẩm
      } catch (err) {
        console.error("Error fetching related products:", err);
        if (axios.isAxiosError(err)) {
          console.error("Response data:", err.response?.data);
          console.error("Status code:", err.response?.status);
        }
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    getRelated();
  }, [id]);

  // Fetch last viewed products
  useEffect(() => {
    const fetchLastViewed = async () => {
      try {
        console.log(" Đang fetch last viewed...");

        // Lấy danh sách ID từ localStorage
        const viewedIds = JSON.parse(
          localStorage.getItem("lastViewed") || "[]"
        );
        console.log("IDs từ localStorage:", viewedIds);

        if (viewedIds.length > 0) {
          console.log("✓ Có lịch sử xem, đang fetch chi tiết...");

          // Fetch thông tin chi tiết của từng sản phẩm
          const promises = viewedIds.slice(0, 4).map((productId: string) =>
            axios
              .get(`http://localhost:5004/api/products/${productId}`)
              .then((res) => {
                console.log(`Fetched product ${productId}:`, res.data);
                return res.data.data;
              })
              .catch((err) => {
                console.error(`Error fetching product ${productId}:`, err);
                return null;
              })
          );

          const products = await Promise.all(promises);
          const validProducts = products.filter((p) => p !== null);
          console.log("📦 Valid products:", validProducts.length);
          setLastViewed(validProducts);
        } else {
          console.log("⚠️ Chưa có lịch sử, lấy sản phẩm mới nhất...");

          // Nếu chưa có lịch sử, lấy sản phẩm mới nhất
          const res = await axios.get(
            "http://localhost:5004/api/products?limit=4"
          );
          console.log("✅ Response từ products API:", res.data);

          let products: Product[] = [];
          if (res.data.data && res.data.data.items) {
            products = res.data.data.items;
            console.log("✓ Lấy từ data.data.items:", products.length);
          } else if (Array.isArray(res.data.data)) {
            products = res.data.data;
            console.log("✓ Lấy từ data.data:", products.length);
          } else if (Array.isArray(res.data)) {
            products = res.data;
            console.log("✓ Lấy từ data trực tiếp:", products.length);
          }

          console.log("Products cho last viewed:", products.length);
          setLastViewed(products);
        }
      } catch (err) {
        console.error("Error fetching last viewed:", err);
        if (axios.isAxiosError(err)) {
          console.error("Response data:", err.response?.data);
          console.error("Status code:", err.response?.status);
        }
        setLastViewed([]);
      } finally {
        setLoadingLastViewed(false);
      }
    };

    fetchLastViewed();
  }, [id]);

  // Lưu sản phẩm hiện tại vào localStorage
  useEffect(() => {
    if (product && id) {
      const viewedIds = JSON.parse(localStorage.getItem("lastViewed") || "[]");

      // Thêm ID hiện tại vào đầu danh sách, loại bỏ duplicate
      const newViewed = [
        id,
        ...viewedIds.filter((vid: string) => vid !== id),
      ].slice(0, 10); // Giữ tối đa 10 sản phẩm

      localStorage.setItem("lastViewed", JSON.stringify(newViewed));
    }
  }, [product, id]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  // Helper function để lấy tên sản phẩm
  const getProductName = (product: Product) => {
    return product.title || product.name || "Sản phẩm";
  };

  // Helper function để lấy ảnh sản phẩm
  const getProductImage = (product: Product) => {
    return product.image || product.images?.[0] || "/placeholder.jpg";
  };

  if (loading)
    return <div className="p-10 text-center text-xl">Đang tải...</div>;
  if (error || !product)
    return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50">
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
            <p className="text-lg text-gray-700 mb-4">{product.author}</p>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              {product.price.toLocaleString("vi-VN")} đ
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.publisher && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Nhà xuất bản:</strong> {product.publisher}
              </p>
            )}
            {product.stock !== undefined && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Còn lại:</strong> {product.stock} cuốn
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={handleDecrement}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-purple-600"
              >
                <i className="fas fa-minus text-gray-600"></i>
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-purple-600"
              >
                <i className="fas fa-plus text-gray-600"></i>
              </button>
            </div>

            <div className="flex space-x-4 mb-8">
              <button className="flex-1 bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 font-semibold">
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
                  {item.price
                    ? item.price.toLocaleString("vi-VN") + " đ"
                    : "Liên hệ"}
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
                      {item.price.toLocaleString("vi-VN")} đ
                    </span>
                    <button
                      className="text-gray-400 hover:text-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                    >
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <button
                    className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
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
