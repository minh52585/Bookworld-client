import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Package, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import { API_BASE_URL } from "../../configs/api";


// Định nghĩa trạng thái đơn hàng
const ORDER_STATUS = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  shipping: { label: "Đang giao", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
      fetchOrders();
    }, [isAuthenticated]);
  

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = ORDER_STATUS[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={OrderList}
      />
    );
  }


  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-xl text-gray-600">Đang tải...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-500">
              Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      {order.total.toLocaleString()} đ
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-purple-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">
                  Chi tiết đơn hàng #{selectedOrder._id.slice(-8)}
                </h2>
                <p className="text-purple-100 mt-1">
                  Ngày đặt:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="p-6">
                {/* Trạng thái đơn hàng */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Trạng thái đơn hàng
                  </h3>
                  <div className="flex justify-center">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>

                {/* Thông tin người nhận */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Thông tin người nhận
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Người nhận:</p>
                      <p className="font-medium">
                        {selectedOrder.shipping_address.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Điện thoại:</p>
                      <p className="font-medium">
                        {selectedOrder.shipping_address.phone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Địa chỉ:</p>
                      <p className="font-medium">
                        {selectedOrder.shipping_address.address}
                      </p>
                    </div>
                    {selectedOrder.note && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Ghi chú:</p>
                        <p className="font-medium">{selectedOrder.note}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin thanh toán */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Thông tin thanh toán
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Phương thức:</p>
                      <p className="font-medium">
                        {selectedOrder.payment.method === "cod"
                          ? "Thanh toán khi nhận hàng"
                          : "Chuyển khoản"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái:</p>
                      <p className="font-medium">
                        {selectedOrder.payment.status === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <h3 className="text-lg font-semibold mb-3">Sản phẩm đã đặt</h3>
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  item.image || "https://via.placeholder.com/60"
                                }
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg"
                              />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.price.toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-600">
                            {(item.price * item.quantity).toLocaleString()} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tổng tiền */}
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-medium">
                      {selectedOrder.subtotal.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">
                      {selectedOrder.shipping_fee.toLocaleString()} đ
                    </span>
                  </div>
                  {selectedOrder.discount?.amount > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Giảm giá ({selectedOrder.discount.code}):</span>
                      <span className="font-medium text-red-600">
                        -{selectedOrder.discount.amount.toLocaleString()} đ
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-purple-600 pt-2 border-t-2 border-purple-200">
                    <span>Tổng cộng:</span>
                    <span>{selectedOrder.total.toLocaleString()} đ</span>
                  </div>
                </div>

                <button
                  className="w-full mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderList;
