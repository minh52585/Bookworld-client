import React, { useState } from 'react';

const BookDetailPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-gray-50">
   

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Thumbnails */}
          <div className="col-span-1">
            <div className="space-y-4">
              <div className="border-2 border-purple-600 rounded-md p-2 cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100"
                  alt="Book 1"
                  className="w-full"
                />
              </div>
              <div className="border border-gray-300 rounded-md p-2 cursor-pointer hover:border-purple-600">
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"
                  alt="Book 2"
                  className="w-full"
                />
              </div>
              <div className="border border-gray-300 rounded-md p-2 cursor-pointer hover:border-purple-600">
                <img
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100"
                  alt="Book 3"
                  className="w-full"
                />
              </div>
             <div className="border border-gray-300 rounded-md p-2 cursor-pointer hover:border-purple-600">
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100"
                  alt="Book 4"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="col-span-5">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 relative">
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md text-sm">
                <i className="fas fa-book-open text-gray-600"></i>
              </div>
              <div className="absolute top-4 right-4 text-xs text-gray-600">
                <span className="bg-white px-2 py-1 rounded">
                  New York Times Bestseller
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
                alt="Chain of Gold"
                className="w-full rounded-lg shadow-xl"
              />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <h2 className="text-5xl font-bold text-yellow-600 drop-shadow-lg">
                  Chain of Gold
                </h2>
                <p className="text-xl text-gray-700 mt-2">CASSANDRA CLARE</p>
                <p className="text-sm text-gray-600">THE LAST HOURS BOOK ONE</p>
                <p className="text-xs text-gray-600 mt-4">
                  A Brand-New Series in the<br />
                  SHADOWHUNTER WORLD
                </p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-span-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chain of Gold: The Last Hours #1
            </h1>
            <p className="text-lg text-gray-700 mb-4">Cassandra Clare</p>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="ml-2 text-gray-600">4.5</span>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-6">$12.49</div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              From #1 New York Times and USA TODAY bestselling author Cassandra
              Clare comes the first novel in a brand-new trilogy where evil hides
              in plain sight and love cuts deeper than any blade. Chain of Gold is
              a Shadowhunters novel.
            </p>

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
                Add to cart
              </button>
              <button className="px-8 py-3 border border-gray-300 rounded-md hover:border-purple-600 hover:text-purple-600">
                Favorite
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Publisher:</span>
                <span className="text-gray-900 ml-2">Margaret K. Books</span>
              </div>
              <div>
                <span className="text-gray-500">Publication date:</span>
                <span className="text-gray-900 ml-2">March 3, 2020</span>
              </div>
              <div>
                <span className="text-gray-500">Language:</span>
                <span className="text-gray-900 ml-2">English</span>
              </div>
              <div>
                <span className="text-gray-500">Reading age:</span>
                <span className="text-gray-900 ml-2">14+</span>
              </div>
              <div>
                <span className="text-gray-500">Print length:</span>
                <span className="text-gray-900 ml-2">592 pages</span>
              </div>
              <div>
                <span className="text-gray-500">Dimensions:</span>
                <span className="text-gray-900 ml-2">6 × 1.8 × 9 inches</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-start space-x-4">
            <img
              src="https://ui-avatars.com/api/?name=Nguyen+Cuong&background=random"
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-3">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="text-sm text-gray-500">30 phút trước</span>
              </div>
              <p className="font-semibold text-gray-900">Nguyễn Cường</p>
              <p className="text-gray-900 mb-4">Truyện rất hay !</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4">
            <img
              src="https://ui-avatars.com/api/?name=Ngoc+Huy&background=random"
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-3">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="text-sm text-gray-500">15 phút trước</span>
              </div>
              <p className="font-semibold text-gray-900 mb-2">Ngọc Huy</p>
              <p className="text-gray-700">Giá thành rất rẻ, phù hợp túi tiền !</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Collection</h2>
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
                  <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                  <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                  <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                  <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
        <h2 className="text-2xl font-bold mb-6">Last viewed</h2>
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
                <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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
                <i className="fas fa-shopping-cart mr-2"></i>Add to cart
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