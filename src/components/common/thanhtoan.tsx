
import axios from "axios";
import { Trash , ShoppingCart } from "lucide-react";
import React, { useState, useMemo } from 'react';

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  note: string;
}

interface CartItem {
  id: number;      
  name: string;
  image: string;
  quantity: number;
  price: number;
}

function Thanhtoan() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Đặc nhân tâm',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
      quantity: 2,
      price: 100000
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop',
      quantity: 1,
      price: 150000
    }
  ]);

  const shippingFee: number = 30000;

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const total: number = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 
 
 const handleSubmit = async () => {
   //Kiểm tra thông tin bắt buộc
   if (!formData.fullName || !formData.phone || !formData.address) {
     alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
     return;
   }
 
   // Lấy token từ localStorage
   const token = localStorage.getItem("token");
   if (!token) {
     alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để đặt hàng.");
     return;
   }
   console.log("Token gửi đi:", token);
 
   // Chuẩn bị dữ liệu order
   const orderData = {
     ...formData,
     items: cartItems.map(item => ({
       product_id: item.id,
       name: item.name,
       price: item.price,
       quantity: item.quantity
     })),
     paymentMethod,
     subtotal,
     shippingFee,
     total
   };
 
   // Gửi API
   try {
     const res = await axios.post(
       "http://localhost:5004/api/orders",
       orderData,
       {
         headers: {
           Authorization: `Bearer ${token}`
         }
       }
     );
 
     console.log("Order response:", res.data);
     alert("Đặt hàng thành công!");
   } catch (error: any) {
     
     if (axios.isAxiosError(error)) {
       console.error("Axios error response:", error.response?.data);
       alert(
         `Đặt hàng thất bại! Lỗi: ${error.response?.data?.message || error.message}`
       );
     } else {
       console.error("Unknown error:", error);
       alert("Đặt hàng thất bại! Vui lòng thử lại.");
     }
   }
 };
 


 
  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* column-form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <ShoppingCart />
                Thông Tin Giao Hàng
              </h2>

              <div className="space-y-5">
                {/* name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {/* sdt */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {/* address */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {/*note*/}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú cho đơn hàng (nếu có)"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* pttt */}
                <div>
                  <h3 className="text-lg font-bold text-purple-600 mb-4">
                    Phương Thức Thanh Toán
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700 font-medium">
                        Thanh toán khi nhận hàng
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700 font-medium">
                        Chuyển khoản ngân hàng
                      </span>
                    </label>
                  </div>
                </div>

                {/*button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition shadow-lg"
                >
                  Xác Nhận Đặt Hàng
                </button>
              </div>
            </div>
          </div>

          {/*ttdh */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-6">
                Thông tin đặt hàng
              </h2>

              {/* cart item */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">x{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 transition"
                        >
                          <Trash />
                        </button>
                      </div>
                      <p className="text-purple-600 font-bold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* pvc */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">{formatPrice(shippingFee)}</span>
                </div>
                
                <div className="flex justify-between text-xl font-bold text-purple-600 pt-3 border-t border-gray-200">
                  <span>Tổng thanh toán</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thanhtoan;
