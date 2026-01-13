import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import { API_BASE_URL } from "../../configs/api";
import { showNotification } from "../../utils/notification";
import { cloudinaryAxios } from "../../utils/cloudinaryAxios";
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
import {
  Timeline,
  Divider,
  Modal,
  Select,
  Upload,
  Button,
  Image,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  TruckOutlined,
  ShoppingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const STATUS_CONFIG: Record<string, { color: string; icon?: React.ReactNode }> =
  {
    "Chờ xử lý": { color: "orange", icon: <ShoppingOutlined /> },
    "Đã xác nhận": { color: "blue", icon: <CheckOutlined /> },
    "Đang chuẩn bị hàng": { color: "cyan", icon: <ShoppingOutlined /> },
    "Đang giao hàng": { color: "purple", icon: <TruckOutlined /> },
    "Giao hàng không thành công": { color: "red", icon: <CloseOutlined /> },
    "Giao hàng thành công": { color: "green", icon: <CheckOutlined /> },
  };

const ORDER_TYPES_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã hủy', value: 'Đã hủy' },
  { label: 'Chờ xử lý', value: 'Chờ xử lý' },
  { label: 'Giao hàng không thành công', value: '"Giao hàng không thành công' },
  { label: 'Giao hàng thành công', value: 'Giao hàng thành công' },
  { label: 'Đang yêu cầu Trả hàng/Hoàn tiền', value: 'Đang yêu cầu Trả hàng/Hoàn tiền' },
  { label: 'Trả hàng/Hoàn tiền thành công', value: 'Trả hàng/Hoàn tiền thành công' }
];
function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnImages, setReturnImages] = useState<string[]>([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [selectedOrderType, setSelectedOrderType] =  useState<string>('all');

  const navigate = useNavigate();
  const filteredOrders = orders.filter((item) => {
  if (selectedOrderType === 'all') return true;
  return item.status === selectedOrderType;
});

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");

    if (success === "true") {
      fetchOrders();
      showNotification("Thanh toán VNpay thành công!", "success");
      navigate("/order", { replace: true });
    } else if (error) {
      showNotification("Thanh toán thất bại!", "error");
      navigate("/order", { replace: true });
    }
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reacttest");

    try {
      const res = await cloudinaryAxios.post(
        "https://api.cloudinary.com/v1_1/dkpfaleot/image/upload",
        formData
      );

      return res.data.secure_url;
    } catch (error: any) {
      console.error("Cloudinary error:", error.response?.data || error);

      showNotification(
        error.response?.data?.error?.message || "Lỗi tải ảnh",
        "error"
      );

      throw error; // 👈 QUAN TRỌNG
    }
  };

  const submitReturnRequest = async () => {
    if (!returnOrderId || !returnReason) return;

    try {
      setSubmittingReturn(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_BASE_URL}/orders/return-request/${returnOrderId}`,
        {
          reason: returnReason,
          images: returnImages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification(res.data.message || "Đã gửi yêu cầu", "success");

      setReturnModalOpen(false);
      setReturnReason("");
      setReturnImages([]);
      fetchOrders();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể gửi yêu cầu",
        "error"
      );
    } finally {
      setSubmittingReturn(false);
    }
  };

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

  const handleRefundToWallet = async (orderId: string) => {
    Modal.confirm({
      title: "Xác nhận hoàn tiền",
      content: "Bạn có chắc chắn muốn hoàn tiền về ví?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "primary",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${API_BASE_URL}/orders/${orderId}/refund`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            showNotification(response.data.message, "success");
            fetchOrders();
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || "Không thể hoàn tiền";
          showNotification(errMsg, "error");
        }
      },
    });
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
    "Giao hàng không thành công": {
      label: "Giao hàng không thành công",
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-orange-100 text-orange-700 border border-orange-300",
    },
    "Giao hàng thành công": {
      label: "Giao hàng thành công",
      icon: <CheckCheck className="w-4 h-4" />,
      className: "bg-green-100 text-green-700 border border-green-300",
    },
    "Đang yêu cầu Trả hàng/Hoàn tiền": {
      label: "Đang yêu cầu Trả hàng/Hoàn tiền",
      icon: <RotateCcw className="w-4 h-4 animate-spin" />,
      className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    },

    "Trả hàng/Hoàn tiền thành công": {
      label: "Trả hàng/Hoàn tiền thành công",
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-green-100 text-green-700 border border-green-300",
    },

    "Hoàn tất": {
      label: "Hoàn tất",
      icon: <CheckCheck className="w-4 h-4" />,
      className: "bg-blue-100 text-blue-700 border border-blue-300",
    },
  };

  //  Function để hiển thị trạng thái thanh toán
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
    } else if (paymentStatus === "Chưa thanh toán") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-300">
          <Clock className="w-4 h-4" />
          Chưa thanh toán
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-300">
          <Clock className="w-4 h-4" />
          COD
        </span>
      );
    }
  };

  //Function để hiển thị phương thức thanh toán
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
         <Select
                value={selectedOrderType}
                placeholder="-- Chọn trạng thái --"
                allowClear
                style={{ width: 220 }}
                onChange={(value) => setSelectedOrderType(value || "all")}
                options={ORDER_TYPES_OPTIONS}
          />

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
                {filteredOrders.map((order) => (
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
                    <td className="px-6 py-4 text-sm">
                      {order.note &&
                      (order.status === "Đang yêu cầu Trả hàng/Hoàn tiền" ||
                        order.status === "Đã hủy") ? (
                        <Tooltip title={order.note} placement="topLeft">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1 
                                      rounded-full bg-purple-100 text-purple-700 
                                      font-semibold text-xs hover:bg-purple-200 transition"
                          >
                            <StickyNote className="w-4 h-4" />
                            Ghi chú
                          </button>
                        </Tooltip>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* Chi tiết */}
                        <button
                          className="inline-flex items-center gap-1.5 h-8 px-3 
                 text-xs font-medium text-white 
                 bg-purple-600 hover:bg-purple-700 
                 rounded-md transition whitespace-nowrap"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Chi tiết
                        </button>
                        {errorMessage && (
                          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-sm">
                            <XCircle className="w-4 h-4" />
                            {errorMessage}
                          </div>
                        )}
                        {/* Hủy đơn */}
                        {order.status === "Chờ xử lý" && (
                          <button
                            className="inline-flex items-center gap-1.5 h-8 px-3 
                   text-xs font-medium text-white 
                   bg-red-500 hover:bg-red-600 
                   rounded-md transition whitespace-nowrap"
                            onClick={() => {
                              setCancelOrderId(order._id);
                              setShowCancelModal(true);
                            }}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Hủy đơn
                          </button>
                        )}

                        {/* Trả hàng / hoàn tiền */}
                        {order.status === "Giao hàng thành công" &&
                          (order.status_logs?.filter(
                            (log: any) =>
                              log.status === "Đang yêu cầu Trả hàng/Hoàn tiền"
                          ).length || 0) <= 0 && (
                            <button
                              className="inline-flex items-center gap-1.5 h-8 px-3 
                                      text-xs font-medium text-white 
                                      bg-orange-500 hover:bg-orange-600 
                                      rounded-md transition whitespace-nowrap"
                              onClick={() => {
                                setReturnOrderId(order._id);
                                setReturnModalOpen(true);
                              }}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Yêu cầu Trả hàng / Hoàn tiền
                            </button>
                          )}
                        {order.payment?.status === "Chưa thanh toán" &&
                          order.payment?.payment_url && (
                            <button
                              className="inline-flex items-center gap-1.5 h-8 px-3
                                text-xs font-medium text-white
                                bg-green-600 hover:bg-green-700
                                rounded-md transition whitespace-nowrap"
                              onClick={() => {
                                window.location.href =
                                  order.payment.payment_url;
                              }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Thanh toán
                            </button>
                          )}
                      </div>
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

                
              </div>

              <Divider orientation="left">
                Lịch sử thay đổi trạng thái đơn hàng
              </Divider>
              <div style={{ paddingLeft: 24 }}>
                <Timeline
                  items={selectedOrder.status_logs?.map((log: any) => ({
                    color: STATUS_CONFIG[log.status]?.color || "blue",
                    children: (
                      <>
                        {/* <strong>{log.status}</strong>
                              {log.note && <div>{log.note}</div>}
                              <small>
                                {new Date(log.createdAt).toLocaleString("vi-VN")}
                              </small> */}
                        <strong style={{ display: "block" }}>
                          {log.status}
                        </strong>
                         {log.note && <div>{log.note}</div>}
                         {log.status === "Giao hàng thành công" &&
                       
                          selectedOrder.image_completed && (
                            <div style={{ marginTop: 8 }}>
                              <small style={{ color: "#888" }}>Ảnh giao hàng:</small>
                              <br />
                              <Image
                                src={selectedOrder.image_completed}
                                width={120}
                                style={{ marginTop: 4, borderRadius: 6 }}
                                preview
                              />
                            </div>
                          )}
                        <small style={{ color: "#888" }}>
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </small>
                      </>
                    ),
                  }))}
                />
              </div>

                <button
                  className="w-full mb-50 mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
            </button>
            </div>
          </div>
        )}
      </div>

      <CancelOrderModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={async (note) => {
          try {
            const orderToCancel = orders.find((o) => o._id === cancelOrderId);

            await axios.put(
              `${API_BASE_URL}/orders/${cancelOrderId}`,
              { note },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            const isOnlinePaid =
              orderToCancel?.payment?.status === "Đã thanh toán" &&
              (orderToCancel?.payment?.method === "vnpay" ||
                orderToCancel?.payment?.method === "wallet");

            if (isOnlinePaid) {
              const refundAmount =
                orderToCancel?.total?.toLocaleString("vi-VN") || "0";
              showNotification(
                `Đã hủy đơn hàng và hoàn ${refundAmount}đ về ví thành công!`,
                "success"
              );
            } else {
              showNotification("Đã hủy đơn hàng thành công!", "success");
            }

            setShowCancelModal(false);
            setCancelOrderId(null);

          } catch (error: any) {
            const errMsg =
              error.response?.data?.message || "Không thể hủy đơn hàng";
            showNotification(errMsg, "error");
          }
          finally {
            fetchOrders();
          }
        }}
      />
      <Modal
        title="Yêu cầu Trả hàng / Hoàn tiền"
        open={returnModalOpen}
        onCancel={() => {
          setReturnModalOpen(false);
          setReturnReason("");
          setReturnImages([]);
        }}
        footer={null}
      >
        {/* Lý do */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Lý do</label>
          <Select
            placeholder="Chọn lý do"
            style={{ width: "100%" }}
            value={returnReason}
            onChange={setReturnReason}
            options={[
              { value: "Sản phẩm lỗi", label: "Sản phẩm lỗi" },
              { value: "Giao sai sản phẩm", label: "Giao sai sản phẩm" },
              { value: "Không đúng mô tả", label: "Không đúng mô tả" },
              { value: "Khác", label: "Khác" },
            ]}
          />
        </div>

        {/* Upload ảnh */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Ảnh minh chứng (tối đa 3)
          </label>

          <Upload
            listType="picture-card"
            maxCount={3}
            beforeUpload={async (file) => {
              try {
                const url = await uploadImage(file);
                setReturnImages((prev) => [...prev, url]);
              } catch {
                showNotification("Upload ảnh thất bại", "error");
              }
              return false;
            }}
            onRemove={(file) => {
              setReturnImages((prev) =>
                prev.filter((_, idx) => String(idx) !== file.uid)
              );
            }}
            fileList={returnImages.map((url, idx) => ({
              uid: String(idx),
              name: `image-${idx}`,
              status: "done",
              url,
            }))}
          >
            {returnImages.length < 3 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
        </div>

        {/* Submit */}
        <Button
          type="primary"
          danger
          block
          loading={submittingReturn}
          disabled={!returnReason}
          onClick={submitReturnRequest}
        >
          Gửi yêu cầu
        </Button>
      </Modal>
    </div>
  );
}

export default OrderList;
