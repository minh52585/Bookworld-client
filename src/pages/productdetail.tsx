import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  totalReviews: number;
  description: string;
  images?: string[];
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

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
        const res = await axios.get(`http://localhost:5004/api/products/${id}/related`);
        setRelatedProducts(res.data.data);
      } catch (err) {
        console.error(err);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    getRelated();
  }, [id]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  if (loading) return <div className="p-10 text-center text-xl">Đang tải...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Thumbnails */}
          <div className="col-span-1">
            <div className="space-y-4">
              {product.images?.map((img, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-md p-2 cursor-pointer hover:border-purple-600"
                >
                  <img src={img} alt={`thumb-${index}`} className="w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="col-span-5">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 relative">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="col-span-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-4">{product.author}</p>
            <div className="text-4xl font-bold text-gray-900 mb-6">${product.price}</div>
            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

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

      {/* Collection Section */}
      <div className="mt-10 container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>

        {loadingRelated ? (
          <p>Đang tải sản phẩm liên quan...</p>
        ) : relatedProducts.length === 0 ? (
          <p>Không có sản phẩm liên quan</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg">
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  className="h-40 w-full object-cover rounded"
                  alt={item.name}
                />
                <h3 className="font-semibold mt-2">{item.name}</h3>
                <p className="text-red-500">{item.price ? item.price.toLocaleString() + " đ" : "Liên hệ"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Viewed Section */}
      <div className="mt-10 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Lượt xem gần đây</h2>
        <div className="grid grid-cols-4 gap-6">
          {/* Ví dụ 4 sản phẩm tĩnh, bạn có thể thay bằng state nếu có API */}
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300"
                alt={`last-viewed-${idx}`}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Tên sách {idx + 1}</h3>
                <p className="text-sm text-gray-600 mb-2">Tác giả</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$19.99</span>
                  <button className="text-gray-400 hover:text-purple-600">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                  <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
