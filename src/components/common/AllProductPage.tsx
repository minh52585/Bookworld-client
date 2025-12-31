import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ============= TYPES =============
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  author: string;
  namxuatban: number;
  nhaxuatban: string;
  sotrang: number;
  description: string;
  images: string[];
  category: Category;
  weight: number;
  size: string;
  sku: string;
  minPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
}

interface Filters {
  search: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  sortBy: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    items: Product[];
    total: number;
    page: number;
    limit: number;
  };
}

const API_BASE_URL = "http://localhost:5002/api";

// ============= MAIN COMPONENT =============
const AllProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    minPrice: 0,
    maxPrice: 1000000,
    rating: null,
    sortBy: "newest",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories?status=active`);

        const data = await res.json();

        if (data?.data?.items && Array.isArray(data.data.items)) {
          setCategories(data.data.items);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filters.search) params.append("search", filters.search);
        if (filters.categories.length > 0)
          params.append("category", filters.categories[0]);
        if (filters.sortBy) params.append("sort", filters.sortBy);

        const response = await fetch(
          `${API_BASE_URL}/products?${params.toString()}`
        );
        const data: ApiResponse = await response.json();

        console.log("Products response:", data); // DEBUG

        // Kiểm tra structure response
        if (!data.data || !data.data.items) {
          console.error("Products response format không đúng:", data);
          setProducts([]);
          setTotal(0);
          return;
        }

        let filteredProducts = data.data.items;

        // Client-side filters (vì BE chưa có)
        if (filters.rating) {
          filteredProducts = filteredProducts.filter(
            (p) => (p.averageRating || 0) >= filters.rating!
          );
        }
        if (filters.minPrice > 0 || filters.maxPrice < 1000000) {
          filteredProducts = filteredProducts.filter(
            (p) =>
              (p.minPrice || 0) >= filters.minPrice &&
              (p.minPrice || 0) <= filters.maxPrice
          );
        }

        setProducts(filteredProducts);
        setTotal(data.data.total);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, filters]);
  const handleProductClick = (id: string) => {
    if (!id) return;
    navigate(`/products/${id}`);
    window.scrollTo(0, 0);
  };
  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [categoryId],
    }));
    setPage(1);
  };

  const handleRatingFilter = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? null : rating,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      minPrice: 0,
      maxPrice: 1000000,
      rating: null,
      sortBy: "newest",
    });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  // ============= RENDER =============
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              Tất cả sản phẩm
            </h1>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Danh mục</h3>
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500">Không có danh mục</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(cat._id)}
                          onChange={() => handleCategoryToggle(cat._id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Đánh giá</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingFilter(rating)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        filters.rating === rating
                          ? "bg-blue-50 border-2 border-blue-500 shadow-sm"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">trở lên</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Khoảng giá</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Từ (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: Number(e.target.value),
                        }));
                        setPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Đến (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: Number(e.target.value),
                        }));
                        setPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg mb-2">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="text-gray-400 text-sm">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Hiển thị{" "}
                    <span className="font-semibold">{products.length}</span> /{" "}
                    <span className="font-semibold">{total}</span> sản phẩm
                  </p>
                </div>

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
                        {product.category && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {product.category.name}
                          </div>
                        )}
                      </div>

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
                          <div>
                            <span className="text-lg font-bold text-red-600">
                              {product.displayPrice
                                ? product.displayPrice.toLocaleString("vi-VN") +
                                  "₫"
                                : "Liên hệ"}
                            </span>
                          </div>
                          <button className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                page === pageNum
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === page - 2 ||
                          pageNum === page + 2
                        ) {
                          return (
                            <span key={pageNum} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
