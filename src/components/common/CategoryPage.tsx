import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api";

interface Product {
  _id: string;
  name: string;
  author: string;
  images: string[];
  minPrice?: number;
  displayPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    _id: string;
    name: string;
  };
}

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/products?category=${id}`);

        const data = res.data;
        let productsList: Product[] = [];

        if (data.data?.items) {
          productsList = data.data.items;
        } else if (Array.isArray(data.data)) {
          productsList = data.data;
        } else if (Array.isArray(data)) {
          productsList = data;
        }

        setProducts(productsList);

        // Lấy tên danh mục từ sản phẩm đầu tiên
        if (productsList.length > 0 && productsList[0].category) {
          setCategoryName(productsList[0].category.name);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName || "Danh mục"}
          </h1>
          <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">
              Chưa có sản phẩm trong danh mục này
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                  <img
                    src={
                      product.images[0] ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.category?.name && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {product.category.name}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{product.author}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-star text-sm ${
                          i < Math.floor(product.averageRating || 0)
                            ? "fas text-yellow-400"
                            : "far text-gray-300"
                        }`}
                      ></i>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">
                      {product.displayPrice ?? product.minPrice
                        ? (product.displayPrice ??
                            product.minPrice)!.toLocaleString("vi-VN") + "₫"
                        : "Liên hệ"}
                    </span>
                    <button className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
