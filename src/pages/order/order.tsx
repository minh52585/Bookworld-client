import React, { useState } from "react";

// Mock data đơn hàng
const mockOrders = [
  {
    _id: "1",
    user_id: "user1",
    subtotal: 150000,
    shipping_fee: 30000,
    discount: { code: "SALE10", amount: 10000 },
    total: 170000,
    status: "pending",
    payment: { method: "cod", status: "pending" },
    shipping_address: { name: "Nguyen Van A", phone: "0123456789", address: "Hanoi" },
    note: "Giao nhanh",
    items: [
      { product_id: "p1", name: "Sách React", price: 50000, quantity: 2 },
      { product_id: "p2", name: "Sách Node.js", price: 50000, quantity: 1 },
    ],
    createdAt: "2025-12-04T00:00:00Z",
  },
  {
    _id: "2",
    user_id: "user2",
    subtotal: 80000,
    shipping_fee: 30000,
    discount: { code: "", amount: 0 },
    total: 110000,
    status: "confirmed",
    payment: { method: "cod", status: "paid" },
    shipping_address: { name: "Tran Thi B", phone: "0987654321", address: "HCM" },
    note: "",
    items: [{ product_id: "p3", name: "Sách Vue.js", price: 80000, quantity: 1 }],
    createdAt: "2025-12-03T10:00:00Z",
  },
];

function OrderList() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Mã đơn</th>
            <th className="border px-4 py-2">Ngày tạo</th>
            <th className="border px-4 py-2">Tổng tiền</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => (
            <tr key={order._id}>
              <td className="border px-4 py-2">{order._id}</td>
              <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{order.total.toLocaleString()} VND</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => setSelectedOrder(order)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="mt-6 border rounded p-4 shadow-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Chi tiết đơn hàng {selectedOrder._id}</h2>
          <p><strong>Người nhận:</strong> {selectedOrder.shipping_address.name}</p>
          <p><strong>Điện thoại:</strong> {selectedOrder.shipping_address.phone}</p>
          <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address.address}</p>
          <p><strong>Ghi chú:</strong> {selectedOrder.note || "Không có"}</p>
          <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment.method}</p>
          <p><strong>Trạng thái thanh toán:</strong> {selectedOrder.payment.status}</p>

          <h3 className="mt-4 font-semibold">Sản phẩm:</h3>
          <table className="min-w-full border border-gray-300 mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Tên sản phẩm</th>
                <th className="border px-4 py-2">Số lượng mua</th>
                <th className="border px-4 py-2">
                  <img
                    src="https://via.placeholder.com/60"
                    alt="Ảnh sản phẩm"
                    className="w-14 h-14 object-cover rounded-md mx-auto"
                />Ảnh sản phẩm</th>
                <th className="border px-4 py-2">Giá</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.price.toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-2"><strong>Subtotal:</strong> {selectedOrder.subtotal.toLocaleString()} VND</p>
          <p><strong>Shipping Fee:</strong> {selectedOrder.shipping_fee.toLocaleString()} VND</p>
          <p><strong>Discount:</strong> {selectedOrder.discount.amount.toLocaleString()} VND</p>
          <p className="font-bold"><strong>Total:</strong> {selectedOrder.total.toLocaleString()} VND</p>

          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setSelectedOrder(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderList;
