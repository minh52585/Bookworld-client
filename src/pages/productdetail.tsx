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
  images: string[];
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/products/${id}`);
        setProduct(res.data.data); // BE của bạn trả về { data: {...} }
      } catch (error) {
        setError("Không tìm thấy sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  // Loading
  if (loading) {
    return <div className="p-10 text-center text-xl">Đang tải...</div>;
  }

  // Error
  if (error || !product) {
    return <div className="p-10 text-center text-red-500 text-xl">{error}</div>;
  }

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
                src={product.images?.[0] || ""}
                alt={product.name}
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="col-span-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <p className="text-lg text-gray-700 mb-4">{product.author}</p>

            <div className="text-4xl font-bold text-gray-900 mb-6">
              ${product.price}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

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
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 bg-white rounded-full w-12 h-12 shadow-lg z-10 hover:bg-gray-50">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300"
                alt="Chain of Iron"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">
                  Chain of Iron: Volume 2
                </h3>
                <p className="text-sm text-gray-600 mb-2">Cassandra Clare</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$23.24</span>
                  <button className="text-purple-600 hover:text-purple-800">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                  <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300"
                alt="Chain of Thorns"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Chain of Thorns</h3>
                <p className="text-sm text-gray-600 mb-2">Cassandra Clare</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$23.24</span>
                  <button className="text-gray-400 hover:text-purple-600">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                  <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300"
                alt="City of Fallen Angels"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">
                  City of Fallen Angels
                </h3>
                <p className="text-sm text-gray-600 mb-2">Cassandra Clare</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$13.94</span>
                  <button className="text-gray-400 hover:text-purple-600">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                  <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300"
                alt="Nona the Ninth"
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Nona the Ninth</h3>
                <p className="text-sm text-gray-600 mb-2">Cassandra Clare</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">$16.84</span>
                  <button className="text-gray-400 hover:text-purple-600">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                  <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full w-12 h-12 shadow-lg z-10 hover:bg-gray-50">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Last Viewed Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Lượt xem gần đây</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300"
              alt="The Librarian Spy"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">The Librarian Spy</h3>
              <p className="text-sm text-gray-600 mb-2">Madeline Martin</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$16.73</span>
                <button className="text-purple-600 hover:text-purple-800">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300"
              alt="Other Birds"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">Other Birds</h3>
              <p className="text-sm text-gray-600 mb-2">Sarah Addison Allen</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$26.03</span>
                <button className="text-gray-400 hover:text-purple-600">
                  <i className="far fa-heart"></i>
                </button>
              </div>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300"
              alt="The Ways We Hide"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">The Ways We Hide</h3>
              <p className="text-sm text-gray-600 mb-2">Kristina McMorris</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$27.93</span>
                <button className="text-gray-400 hover:text-purple-600">
                  <i className="far fa-heart"></i>
                </button>
              </div>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"
              alt="Room and Board"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">Room and Board</h3>
              <p className="text-sm text-gray-600 mb-2">Miriam Parker</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$15.81</span>
                <button className="text-gray-400 hover:text-purple-600">
                  <i className="far fa-heart"></i>
                </button>
              </div>
              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700">
                <i className="fas fa-shopping-cart mr-2"></i>Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

   
    </div>
  );
};

export default BookDetailPage;