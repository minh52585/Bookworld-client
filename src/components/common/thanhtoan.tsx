import React, { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Trash } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
}

export default function Thanhtoan() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressDetail: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // lấy thông tin user
 useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user = JSON.parse(savedUser);

    setFormData((prev) => ({
      ...prev,
      fullName: user.fullname || "",
      email: user.email || "",
    }));
  }
}, []);

  // giỏ hàng
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Đắc nhân tâm",
      price: 200000,
      quantity: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1b0XHbGdQaJY9MUcP4h8gJRegE8bFsnxKQ&s",
    },
    {
      id: 2,
      name: "Sản phẩm 2",
      price: 150000,
      quantity: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkE2Vu4xX2lvHU0HK0oSlZhaHdFHMzOjviGQ&s",
    },
  ];

  const shippingFee = 30000;

  const totalPrice = useMemo(() => {
    return (
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      shippingFee
    );
  }, [cartItems]);

  const provinces = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

  const districts: any = {
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7"],
    "Hà Nội": ["Ba Đình", "Đống Đa", "Cầu Giấy"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Ngũ Hành Sơn"],
  };

  const wards: any = {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành"],
    "Quận 3": ["Phường 1", "Phường 2"],
    "Quận 7": ["Tân Phong", "Tân Phú"],
    "Ba Đình": ["Liễu Giai", "Ngọc Hà"],
    "Đống Đa": ["Trung Liệt", "Khâm Thiên"],
    "Cầu Giấy": ["Quan Hoa", "Nghĩa Tân"],
    "Hải Châu": ["Hải Châu 1", "Hải Châu 2"],
    "Thanh Khê": ["Chính Gián", "Thạc Gián"],
    "Ngũ Hành Sơn": ["Mỹ An", "Khuê Mỹ"],
  };

  // validate
  const validateForm = () => {
    let newErrors: any = {};

    if (!formData.fullName) newErrors.fullName = "Họ tên không được để trống";
    if (!formData.email) newErrors.email = "Email không được để trống";
    if (!formData.phone) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!formData.district) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!formData.addressDetail)
newErrors.addressDetail = "Vui lòng nhập địa chỉ chi tiết";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    alert("Đặt hàng thành công!");
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "province") {
      setFormData({
        ...formData,
        province: value,
        district: "",
        ward: "",
      });
      return;
    }

    if (name === "district") {
      setFormData({
        ...formData,
        district: value,
        ward: "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });

    setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className=" bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white shadow-lg rounded-xl p-8 lg:col-span-2">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2 mb-6">
            <ShoppingCart /> Thông Tin Giao Hàng
          </h2>
          <div className="mb-4">
            <label className="font-medium">Họ và tên <span className="text-red-500">*</span></label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập họ và tên"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Số điện thoại <span className="text-red-500">*</span></label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
            <select
              name="province"
              value={formData.province}
onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn tỉnh/thành --</option>
              {provinces.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm">{errors.province}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Quận / Huyện <span className="text-red-500">*</span></label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={!formData.province}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn quận/huyện --</option>
              {districts[formData.province]?.map((d: string) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Phường / Xã <span className="text-red-500">*</span></label>
            <select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              disabled={!formData.district}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
            >
              <option value="">-- Chọn phường/xã --</option>
              {wards[formData.district]?.map((w: string) => (
                <option key={w}>{w}</option>
              ))}
            </select>
            {errors.ward && (
              <p className="text-red-500 text-sm">{errors.ward}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="font-medium">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
            <input
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg bg-gray-50"
              placeholder="Nhập địa chỉ chi tiết"
            />
            {errors.addressDetail && (
              <p className="text-red-500 text-sm">{errors.addressDetail}</p>
            )}
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-600 mb-4">
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
checked={paymentMethod === "cod"}
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
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">
                  Chuyển khoản ngân hàng
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white p-4 rounded-lg font-bold hover:bg-purple-700 mt-4"
          >
            Xác Nhận Đặt Hàng
          </button>
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">
            Thông tin đặt hàng
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-6 border-b pb-4"
            >
              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 px-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">x{item.quantity}</p>
                <p className="font-bold text-purple-600">
                  {item.price.toLocaleString()}đ
                </p>
              </div>

              <button className="text-red-500">
                <Trash />
              </button>
            </div>
          ))}

          <div className="flex justify-between text-gray-700 mb-3">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString()}đ</span>
          </div>

          <div className="flex justify-between font-bold text-xl text-purple-600">
            <span>Tổng thanh toán</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}