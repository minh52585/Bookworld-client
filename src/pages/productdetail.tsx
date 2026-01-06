import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./Auth/LoginModal";
import { API_BASE_URL } from "../configs/api";
import { showNotification } from "../utils/notification";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

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
  size: string;
  weight: number;
  quantity?: number;
  category?: {
    _id?: string;
    name?: string;
  };
  averageRating?: number;
  reviewCount?: number;
  displayPrice?: number;
  minPrice?: number;
}

interface Category {
  name?: string;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: string;
  rating: number;
  comment: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<any[]>([]);
  const [category, setCategory] = useState<Category>({});
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  const [pageError, setPageError] = useState("");
  const [cartError, setCartError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [lastViewed, setLastViewed] = useState<Product[]>([]);
  const [loadingLastViewed, setLoadingLastViewed] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteNotification, setShowFavoriteNotification] =
    useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  const [canScrollLeftRelated, setCanScrollLeftRelated] = useState(false);
  const [canScrollRightRelated, setCanScrollRightRelated] = useState(true);
  const [canScrollLeftViewed, setCanScrollLeftViewed] = useState(false);
  const [canScrollRightViewed, setCanScrollRightViewed] = useState(true);

  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const viewedScrollRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAuth();

  const getErrorMessage = (err: any) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data?.msg ||
    "Có lỗi xảy ra, vui lòng thử lại";

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}`);
        const productData = res.data.data.product;
        const variantList = res.data.data.variant || [];

        setProduct(productData);
        setVariants(variantList);

        // chọn mặc định bìa mềm
        if (variantList.length > 0) {
          const softCover =
            variantList.find(
              (v: any) =>
                v.type?.toLowerCase().includes("Bìa mềm") && v.quantity > 0
            ) ||
            variantList.find((v: any) => v.quantity > 0) ||
            variantList[0];

          setSelectedVariant(softCover);
          setQuantity(1);
        }

        setCategory(res.data.data.category || []);
      } catch (err) {
        setPageError("Không tìm thấy sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/reviews/products/${id}`);
        const reviewsData = res.data.data || res.data || [];
        setReviews(reviewsData);

        // Calculate average rating
        if (reviewsData.length > 0) {
          const sum = reviewsData.reduce(
            (acc: number, r: Review) => acc + r.rating,
            0
          );
          setAverageRating(sum / reviewsData.length);
        }

        // Check if user has already reviewed
        if (isAuthenticated && user) {
          const existingReview = reviewsData.find(
            (r: Review) => r.user._id === user._id || r.user._id === user.id
          );
          if (existingReview) {
            setUserReview(existingReview);
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !id) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/me/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        let favoritesList: any[] = [];
        const data = response.data;

        if (Array.isArray(data)) {
          favoritesList = data;
        } else if (data.data && Array.isArray(data.data)) {
          favoritesList = data.data;
        } else if (data.favorites && Array.isArray(data.favorites)) {
          favoritesList = data.favorites;
        }

        const isFav = favoritesList.some(
          (item) => item.product?._id === id || item.product === id
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
      }
    };

    checkFavoriteStatus();
  }, [isAuthenticated, id]);

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

        // Fetch category info cho từng product
        const productsWithCategory = await Promise.all(
          products.map(async (product) => {
            // Nếu category là string ID, fetch detail
            if (product.category && typeof product.category === "string") {
              try {
                const catRes = await axios.get(
                  `${API_BASE_URL}/categories/${product.category}`
                );
                return {
                  ...product,
                  category: catRes.data.data || catRes.data,
                };
              } catch {
                return product;
              }
            }
            return product;
          })
        );

        const filtered = productsWithCategory.filter((p) => p._id !== id);
        setRelatedProducts(filtered.slice(0, 8));
      } catch (err) {
        console.error("Error fetching related:", err);
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
              .then((res) => res.data.data.product)
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
    if (!product?._id) return;

    const viewedIds: string[] = JSON.parse(
      localStorage.getItem("lastViewed") || "[]"
    );

    const newViewed = [
      product._id,
      ...viewedIds.filter((vid) => vid !== product._id),
    ].slice(0, 10);

    localStorage.setItem("lastViewed", JSON.stringify(newViewed));
  }, [product]);

  // Check if user has purchased this product
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!isAuthenticated || !id) {
        setCheckingPurchase(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/check-purchase/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCanReview(
          response.data.data?.hasPurchased ||
            response.data.hasPurchased ||
            false
        );
      } catch (err) {
        console.error("Error checking purchase:", err);
        setCanReview(false);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchaseStatus();
  }, [id, isAuthenticated]);

  useEffect(() => {
    checkScrollabilityRelated();
    const container = relatedScrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollabilityRelated);
      return () =>
        container.removeEventListener("scroll", checkScrollabilityRelated);
    }
  }, [relatedProducts]);

  useEffect(() => {
    checkScrollabilityViewed();
    const container = viewedScrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollabilityViewed);
      return () =>
        container.removeEventListener("scroll", checkScrollabilityViewed);
    }
  }, [lastViewed]);

  const checkScrollabilityRelated = () => {
    if (relatedScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = relatedScrollRef.current;
      setCanScrollLeftRelated(scrollLeft > 0);
      setCanScrollRightRelated(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const checkScrollabilityViewed = () => {
    if (viewedScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewedScrollRef.current;
      setCanScrollLeftViewed(scrollLeft > 0);
      setCanScrollRightViewed(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollRelated = (direction: "left" | "right") => {
    if (relatedScrollRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        relatedScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      relatedScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const scrollViewed = (direction: "left" | "right") => {
    if (viewedScrollRef.current) {
      const scrollAmount = 280;
      const newScrollLeft =
        viewedScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      viewedScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!canReview) {
      setReviewError("Bạn cần mua sản phẩm này trước khi đánh giá");
      return;
    }
    if (reviewImages.length + files.length > 5) {
      setReviewError("Tối đa 5 ảnh");
      return;
    }

    setUploadingImages(true);
    setReviewError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          `${API_BASE_URL}/upload/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        return response.data.url || response.data.data?.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setReviewImages([...reviewImages, ...uploadedUrls.filter(Boolean)]);
    } catch (err: any) {
      setReviewError(getErrorMessage(err));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    if (!selectedVariant) return;
    setCartError("");
    setQuantity((prev) => {
      const max = selectedVariant.quantity ?? 1;
      return prev < max ? prev + 1 : prev;
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!product || !selectedVariant) return;

    if (selectedVariant.quantity === 0) {
      setCartError("Biến thể này đã hết hàng!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/cart/items`,
        {
          product_id: product._id,
          variant_id: selectedVariant._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));

      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 2000);
      setQuantity(1);
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setCartError(msg);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!product) return;

    try {
      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/me/favorite/${product._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsFavorite(false);
        setFavoriteMessage("Đã xóa khỏi yêu thích");
      } else {
        await axios.post(
          `${API_BASE_URL}/me/favorites`,
          { product_id: product._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(true);
        setFavoriteMessage("Đã thêm vào yêu thích");
      }

      setShowFavoriteNotification(true);
      setTimeout(() => setShowFavoriteNotification(false), 2000);
    } catch (error: any) {
      console.error("Favorite error:", error.response?.data);
      setFavoriteMessage(error.response?.data?.message || "Có lỗi xảy ra");
      setShowFavoriteNotification(true);
    }
  };

  // Review handlers
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!canReview) {
      setReviewError("Bạn cần mua sản phẩm này trước khi đánh giá");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      if (isEditingReview && userReview) {
        // Update existing review
        const res = await axios.put(
          `${API_BASE_URL}/reviews/${userReview._id}`,
          {
            rating: reviewRating,
            comment: reviewComment,
            images: reviewImages,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedReview = res.data.data || res.data;
        setUserReview(updatedReview);
        setReviews(
          reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r))
        );
      } else {
        // Create new review
        const res = await axios.post(
          `${API_BASE_URL}/reviews/products/${id}`,
          {
            rating: reviewRating,
            comment: reviewComment,
            images: reviewImages,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const newReview = res.data.data || res.data;
        setUserReview(newReview);
        setReviews([newReview, ...reviews]);
      }

      // Reset form
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      setReviewImages([]);
      setReviewError("");
      setIsEditingReview(false);

      // Recalculate average
      const allReviews = isEditingReview
        ? reviews
        : [{ rating: reviewRating }, ...reviews];
      const sum = allReviews.reduce((acc: any, r: any) => acc + r.rating, 0);
      setAverageRating(sum / allReviews.length);
    } catch (err: any) {
      setReviewError(getErrorMessage(err));
    }
  };
  const handleEditReview = () => {
    if (userReview) {
      setReviewRating(userReview.rating);
      setReviewComment(userReview.comment);
      setReviewImages(userReview.images || []);
      setIsEditingReview(true);
      setShowReviewForm(true);
    }
  };

  const renderStars = (
    rating: number,
    interactive: boolean = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : ""
            } transition`}
          >
            <i
              className={`${
                star <= rating ? "fas text-yellow-400" : "far text-gray-300"
              } fa-star text-xl`}
            ></i>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProductName = (p: Product) => p.name || "Sản phẩm";
  const getProductImage = (p: Product) =>
    p.image || p.images?.[0] || "/placeholder.jpg";
  const getProductImages = (p: Product) => {
    if (p.images && p.images.length > 0) return p.images;
    if (p.image) return [p.image];
    return ["/placeholder.jpg"];
  };

  const handlePreviousImage = () => {
    const images = getProductImages(product);
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    const images = getProductImages(product);
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return <div className="p-10 text-center text-xl">Đang tải...</div>;
  if (pageError || !product)
    return (
      <div className="p-10 text-center text-red-500 text-xl">{pageError}</div>
    );

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

      {showFavoriteNotification && (
        <div className="fixed top-4 right-4 z-50 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <i className="fas fa-heart text-xl"></i>
            <span>{favoriteMessage}</span>
          </div>
        </div>
      )}

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Image */}
          <div className="col-span-6">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 relative">
              <img
                src={getProductImages(product)[selectedImageIndex]}
                alt={getProductName(product)}
                className="w-full rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Navigation Arrows */}
              {getProductImages(product).length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {getProductImages(product).length}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {getProductImages(product).length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {getProductImages(product).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImageIndex === index
                        ? "border-purple-600"
                        : "border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${getProductName(product)} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="col-span-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getProductName(product)}
            </h1>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Danh mục: {category.name}
            </h1>

            {/* Average Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center space-x-3 mb-4">
                {renderStars(Math.round(averageRating))}
                <span className="text-lg font-semibold text-gray-700">
                  {averageRating.toFixed(1)} / 5
                </span>
                <span className="text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>
            )}

            <p className="text-lg text-gray-700 mb-4">
              Tác giả: {product.author}
            </p>
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
            {product.size && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Kích thước:</strong> {product.size}
              </p>
            )}
            {product.weight && (
              <p className="text-sm text-gray-600 mb-2">
                <strong>Trọng lượng:</strong> {product.weight}g
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
                      setCartError("");
                      setQuantity((prev) =>
                        v.quantity && prev > v.quantity ? v.quantity : 1
                      );
                    }}
                    className={`px-4 py-2 border rounded-md font-medium transition
                      ${
                        selectedVariant?._id === v._id
                          ? "border-purple-600 text-purple-600 bg-purple-50"
                          : "border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600"
                      }`}
                  >
                    {v.type}
                  </button>
                ))}
              </div>
              {selectedVariant && selectedVariant.quantity === 0 && (
                <p className="text-red-600 font-semibold mt-2">
                  Loại bìa này đã hết hàng!
                </p>
              )}
              {cartError && (
                <p className="text-red-600 font-semibold mt-2">{cartError}</p>
              )}
              {selectedVariant && selectedVariant.quantity > 0 && (
                <p className="text-2xl font-bold text-red-600 mt-4 mb-2">
                  Đơn giá:{" "}
                  {selectedVariant.price?.toLocaleString("vi-VN") ?? "0"} đ
                </p>
              )}

              {selectedVariant?.quantity !== undefined && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Còn lại:</strong> {selectedVariant.quantity} cuốn
                </p>
              )}

              {(!selectedVariant || selectedVariant.quantity > 0) && (
                <div className="flex items-center space-x-4 mb-8">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center
      ${
        quantity <= 1
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-purple-600"
      }`}
                  >
                    <i className="fas fa-minus text-gray-600"></i>
                  </button>

                  {/* INPUT NHẬP TAY */}
                  <input
                    type="number"
                    min={1}
                    max={selectedVariant?.quantity ?? 1}
                    value={quantity}
                    disabled={!selectedVariant}
                    onChange={(e) => {
                      let val = Number(e.target.value);

                      if (isNaN(val)) return;
                      if (val < 1) val = 1;

                      if (
                        selectedVariant?.quantity &&
                        val > selectedVariant.quantity
                      ) {
                        val = selectedVariant.quantity;
                      }

                      setQuantity(val);
                    }}
                    className={`w-20 text-center border rounded-md py-1 text-lg
      ${
        !selectedVariant
          ? "bg-gray-100 cursor-not-allowed"
          : "border-gray-300 focus:border-purple-600 focus:outline-none"
      }
    `}
                  />

                  <button
                    onClick={handleIncrement}
                    disabled={
                      !selectedVariant ||
                      quantity >= (selectedVariant.quantity || 0)
                    }
                    className={`w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center
      ${
        !selectedVariant || quantity >= (selectedVariant.quantity || 0)
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-purple-600"
      }`}
                  >
                    <i className="fas fa-plus text-gray-600"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  selectedVariant.quantity === 0 ||
                  quantity > selectedVariant.quantity
                }
                className={`
                  flex-1 px-8 py-3 rounded-md font-semibold 
                  ${
                    selectedVariant && selectedVariant.quantity > 0
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {selectedVariant?.quantity === 0
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`px-8 py-3 border-2 rounded-md font-semibold transition ${
                  isFavorite
                    ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600"
                }`}
              >
                <i
                  className={`${isFavorite ? "fas" : "far"} fa-heart mr-2`}
                ></i>
                {isFavorite ? "Đã yêu thích" : "Yêu thích"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

          {/* Review Form */}

          {isAuthenticated && !userReview && !showReviewForm && (
            <>
              {checkingPurchase ? (
                <div className="mb-6 text-gray-600">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang kiểm tra...
                </div>
              ) : canReview ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mb-6 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  <i className="fas fa-star mr-2"></i>
                  Viết đánh giá
                </button>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <i className="fas fa-info-circle mr-2"></i>
                    Bạn cần mua sản phẩm này trước khi có thể đánh giá
                  </p>
                </div>
              )}
            </>
          )}

          {isAuthenticated && userReview && !showReviewForm && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 mb-3">
                Bạn đã đánh giá sản phẩm này
              </p>
              <button
                onClick={handleEditReview}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Chỉnh sửa
              </button>
            </div>
          )}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">
                {isEditingReview
                  ? "Chỉnh sửa đánh giá"
                  : "Viết đánh giá của bạn"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Đánh giá của bạn
                </label>
                {renderStars(reviewRating, true, setReviewRating)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Nhận xét
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  required
                ></textarea>
              </div>

              {/* ← THÊM PHẦN UPLOAD ẢNH */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Thêm ảnh (Tối đa 5 ảnh)
                </label>

                {/* Preview images */}
                {reviewImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {reviewImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`review-${index}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {reviewImages.length < 5 && (
                  <label className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition">
                    <i className="fas fa-camera mr-2"></i>
                    {uploadingImages ? "Đang tải..." : "Thêm ảnh"}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={
                        uploadingImages ||
                        reviewImages.length >= 5 ||
                        !canReview
                      }
                    />
                  </label>
                )}
              </div>

              {reviewError && (
                <p className="text-red-600 text-sm mb-4">{reviewError}</p>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {isEditingReview ? "Cập nhật" : "Gửi đánh giá"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewComment("");
                    setReviewRating(5);
                    setReviewImages([]);
                    setReviewError("");
                    setIsEditingReview(false);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
          {/* Reviews List */}
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-star text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">Chưa có đánh giá nào</p>
                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-2">
                    Đăng nhập để trở thành người đầu tiên đánh giá sản phẩm này
                  </p>
                )}
              </div>
            ) : (
              reviews
                .filter((review) => review.status === "approved")
                .map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-13 mb-3">
                      {review.comment}
                    </p>

                    {/* PHẦN HIỂN THỊ ẢNH */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-13">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`review-img-${idx}`}
                            className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(img, "_blank")}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
            )}
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
          <div className="relative group">
            {/* Left Arrow */}
            {canScrollLeftRelated && (
              <button
                onClick={() => scrollRelated("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={relatedScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex-shrink-0 w-64"
                  onClick={() => handleProductClick(item._id)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                    <img
                      src={getProductImage(item)}
                      alt={getProductName(item)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {item.category?.name && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.category.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                      {getProductName(item)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{item.author}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star text-sm ${
                            i < Math.floor(item.averageRating || 0)
                              ? "fas text-yellow-400"
                              : "far text-gray-300"
                          }`}
                        ></i>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({item.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">
                        {item.displayPrice ?? item.minPrice
                          ? (item.displayPrice ??
                              item.minPrice)!.toLocaleString("vi-VN") + "₫"
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

            {/* Right Arrow */}
            {canScrollRightRelated && (
              <button
                onClick={() => scrollRelated("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}
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
          <div className="relative group">
            {/* Left Arrow */}
            {canScrollLeftViewed && (
              <button
                onClick={() => scrollViewed("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={viewedScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {lastViewed.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex-shrink-0 w-64"
                  onClick={() => handleProductClick(item._id)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                    <img
                      src={getProductImage(item)}
                      alt={getProductName(item)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {item.category?.name && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.category.name}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                      {getProductName(item)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{item.author}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star text-sm ${
                            i < Math.floor(item.averageRating || 0)
                              ? "fas text-yellow-400"
                              : "far text-gray-300"
                          }`}
                        ></i>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({item.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-red-600">
                        {item.displayPrice ?? item.minPrice
                          ? (item.displayPrice ??
                              item.minPrice)!.toLocaleString("vi-VN") + "₫"
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

            {/* Right Arrow */}
            {canScrollRightViewed && (
              <button
                onClick={() => scrollViewed("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
