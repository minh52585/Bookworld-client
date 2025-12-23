import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import { API_BASE_URL } from "../../configs/api";
import {
  Clock,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  CheckCheck,
  RotateCcw,
} from "lucide-react";
import CancelOrderModal from "../../components/modals/CancelOrderModal";
import { StickyNote } from "lucide-react";

function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  // ✅ THÊM: Check query params sau khi VNPay redirect về
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");

    if (success === "true") {
      // ✅ Refetch orders để cập nhật UI
      fetchOrders();

      // ✅ Hiển thị thông báo thành công
      alert("Thanh toán VNPay thành công!");

      // ✅ Xóa query params khỏi URL
      window.history.replaceState({}, "", "/order");
    } else if (error) {
      alert(`Thanh toán thất bại: ${error}`);
      window.history.replaceState({}, "", "/order");
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("📦 Orders từ API:", res.data.data);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    }
    setLoading(false);
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
        onLoginSuccess={fetchOrders}
      />
    );
  }

  const ORDER_STATUS_CONFIG: Record<
    string,
    {
      label: string;
      icon: React.ReactNode;
      className: string;
    }
  > = {
    "Đã hủy": {
      label: "Đã hủy",
      icon: <XCircle className="w-4 h-4" />,
      className: "bg-red-100 text-red-700 border border-red-300",
    },
    "Chờ xử lý": {
      label: "Chờ xử lý",
      icon: <Clock className="w-4 h-4" />,
      className: "bg-gray-100 text-gray-700 border border-gray-300",
    },
    "Đã xác nhận": {
      label: "Đã xác nhận",
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-blue-100 text-blue-700 border border-blue-300",
    },
    "Đang chuẩn bị hàng": {
      label: "Đang chuẩn bị hàng",
      icon: <Package className="w-4 h-4" />,
      className: "bg-indigo-100 text-indigo-700 border border-indigo-300",
    },
    "Đang giao hàng": {
      label: "Đang giao hàng",
      icon: <Truck className="w-4 h-4" />,
      className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    },
    "Giao hàng thành công": {
      label: "Giao hàng thành công",
      icon: <CheckCheck className="w-4 h-4" />,
      className: "bg-green-100 text-green-700 border border-green-300",
    },
    "Trả hàng/Hoàn tiền": {
      label: "Trả hàng/Hoàn tiền",
      icon: <RotateCcw className="w-4 h-4" />,
      className: "bg-purple-100 text-purple-700 border border-purple-300",
    },
  };

  // ✅ THÊM: Function để hiển thị trạng thái thanh toán
  const getPaymentStatusDisplay = (paymentStatus: string) => {
    if (paymentStatus === "Đã thanh toán") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm border border-green-300">
          <CheckCircle className="w-4 h-4" />
          Đã thanh toán
        </span>
      );
    } else if (paymentStatus === "Thất bại") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm border border-red-300">
          <XCircle className="w-4 h-4" />
          Thanh toán thất bại
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-300">
          <Clock className="w-4 h-4" />
          Chưa thanh toán
        </span>
      );
    }
  };

  // ✅ THÊM: Function để hiển thị phương thức thanh toán
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "vnpay":
        return "Thanh toán VNPay";
      case "bank":
        return "Chuyển khoản ngân hàng";
      default:
        return method || "Không xác định";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-xl text-gray-600">Đang tải...</div>
          </div>
        ) : orders.length === 0 ? (
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
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-4 w-[14%] text-left text-sm font-semibold text-gray-700">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 w-[14%] text-left text-sm font-semibold text-gray-700">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 w-[14%] text-left text-sm font-semibold text-gray-700">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 w-[18%] text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 w-[18%] text-left text-sm font-semibold text-gray-700">
                    Ghi chú
                  </th>
                  <th className="px-6 py-4 w-[22%] text-center text-sm font-semibold text-gray-700">
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
                      {(() => {
                        const status = ORDER_STATUS_CONFIG[order.status];
                        return (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                              status?.className ||
                              "bg-gray-100 text-gray-700 border border-gray-300"
                            }`}
                          >
                            {status?.icon}
                            {status?.label || order.status}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm overflow-hidden">
                      {order.note ? (
                        <div className="relative group inline-block">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1 
                                      rounded-full bg-purple-100 text-purple-700 
                                      font-semibold text-xs hover:bg-purple-200 transition"
                          >
                            <StickyNote className="w-4 h-4" />
                            Ghi chú
                          </button>
                          <div
                            className="fixed z-50 hidden group-hover:block 
                                      mt-2 max-w-xs rounded-lg bg-gray-900 
                                      text-white text-xs px-3 py-2 shadow-lg"
                            style={{ transform: "translateY(8px)" }}
                          >
                            {order.note}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                      {order.status === "Chờ xử lý" && (
                        <button
                          className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition ml-2"
                          onClick={() => {
                            setCancelOrderId(order._id);
                            setShowCancelModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                          Hủy đơn
                        </button>
                      )}
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
                    {(() => {
                      const status = ORDER_STATUS_CONFIG[selectedOrder.status];
                      return (
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            status?.className ||
                            "bg-gray-100 text-gray-700 border border-gray-300"
                          }`}
                        >
                          {status?.icon}
                          {status?.label || selectedOrder.status}
                        </span>
                      );
                    })()}
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
                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <p className="font-medium text-gray-800 break-words">
                            {selectedOrder.note}
                          </p>
                        </div>
                        {selectedOrder.status === "Đã hủy" && (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <p className="text-sm text-gray-600 whitespace-nowrap">
                              Ngày hủy:
                            </p>
                            <p className="font-medium text-gray-800">
                              {new Date(selectedOrder.updatedAt).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ SỬA: Thông tin thanh toán */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Thông tin thanh toán
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Phương thức:</p>
                      <p className="font-medium">
                        {getPaymentMethodDisplay(selectedOrder.payment.method)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Trạng thái thanh toán:
                      </p>
                      {getPaymentStatusDisplay(selectedOrder.payment.status)}
                    </div>

                    {/* ✅ THÊM: Hiển thị mã giao dịch nếu có */}
                    {selectedOrder.payment.transaction_id && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-2">
                          Mã giao dịch:
                        </p>
                        <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
                          {selectedOrder.payment.transaction_id}
                        </p>
                      </div>
                    )}

                    {/* ✅ THÊM: Hiển thị thời gian thanh toán */}
                    {selectedOrder.payment.paid_at && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-2">
                          Thời gian thanh toán:
                        </p>
                        <p className="font-medium">
                          {new Date(
                            selectedOrder.payment.paid_at
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
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
                      {selectedOrder.items.map((item: any, idx: number) => {
                        const product = item.product_id;
                        const variant = item.variant_id;
                        const name = product?.name || "Sản phẩm";
                        const variantName = variant?.type
                          ? `(${variant.type})`
                          : "";
                        const price = variant?.price || 0;
                        const image =
                          product?.images?.[0] ||
                          "https://via.placeholder.com/60";

                        return (
                          <tr key={idx}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={image}
                                  alt={name}
                                  className="w-14 h-14 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium">{name}</p>
                                  {variant?.type && (
                                    <p className="text-sm text-gray-500">
                                      {variantName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item.quantity || 1}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {price.toLocaleString()} đ
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-purple-600">
                              {(price * (item.quantity || 1)).toLocaleString()}{" "}
                              đ
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tổng tiền */}
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Tổng tiền hàng:</span>
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

      <CancelOrderModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={async (note) => {
          if (!cancelOrderId) return;

          await axios.put(
            `${API_BASE_URL}/orders/${cancelOrderId}`,
            { note },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setShowCancelModal(false);
          setCancelOrderId(null);
          fetchOrders();
        }}
      />
    </div>
  );
}

export default OrderList;
