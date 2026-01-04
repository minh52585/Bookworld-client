import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../pages/Auth/LoginModal";
import { API_BASE_URL } from "../../configs/api";

interface CartItem {
  product_id: any;
  variant_id?: any;
  quantity: number;
}

function Cart() {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedItems, setAppliedItems] = useState<any[]>([]);

  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!coupon) return;
    if (selectedItems.length === 0) {
      setCouponError("Vui lòng chọn ít nhất 1 sản phẩm để áp mã");
      return;
    }

    setApplying(true);
    setCouponError("");

    try {
      const token = localStorage.getItem("token") || undefined;
      const items = cartItems
        .filter((item) => {
          if (!item.product_id) return false;
          const key = item.product_id._id + (item.variant_id?._id || "");
          return selectedItems.includes(key);
        })
        .map((item) => ({
          product_id: item.product_id._id,
          price: item.variant_id?.price ?? item.product_id?.price ?? 0,
          quantity: item.quantity,
        }));

      const subtotalSelected = items.reduce(
        (s, it) => s + (it.price || 0) * it.quantity,
        0
      );

      const resp = await (
        await import("../../apis/discounts")
      ).validateDiscount(
        {
          code: coupon,
          items,
          subtotal: subtotalSelected,
        },
        token
      );

      const data = resp.data;

      if (!data || !data.valid) {
        setCouponError(data?.message || "Mã không hợp lệ");
        setDiscountAmount(0);
        setAppliedItems([]);
      } else {
        // Prefer server-provided appliedItems
        if (data.appliedItems && Array.isArray(data.appliedItems)) {
          setAppliedItems(data.appliedItems);
          const total = data.appliedItems.reduce(
            (s: any, a: any) => s + (a.discountAmount || 0),
            0
          );
          setDiscountAmount(total || 0);
          localStorage.setItem(
            "pending_discount",
            JSON.stringify({
              code: coupon,
              amount: total || 0,
              appliedItems: data.appliedItems,
            })
          );
        } else if (data.amount !== undefined) {
          // Fallback: distribute amount proportionally among selected items
          const total = data.amount || 0;
          setDiscountAmount(total);

          // distribute proportionally
          const distributed = items.map((it) => {
            const itemSubtotal = it.price * it.quantity;
            const share =
              subtotalSelected > 0
                ? (itemSubtotal / subtotalSelected) * total
                : 0;
            return {
              product_id: it.product_id,
              itemSubtotal,
              discountAmount: Math.round(share),
              finalPrice: Math.max(0, itemSubtotal - Math.round(share)),
            };
          });
          setAppliedItems(distributed);
          localStorage.setItem(
            "pending_discount",
            JSON.stringify({
              code: coupon,
              amount: total || 0,
              appliedItems: distributed,
            })
          );
        }
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || "Lỗi khi kiểm tra mã");
      console.error("Lỗi kiểm tra mã giảm giá:", err);
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    fetchCart();

    try {
      const pending = localStorage.getItem("pending_discount");
      if (pending) {
        const p = JSON.parse(pending);
        if (p.code) setCoupon(p.code || "");
        if (p.amount) {
          setDiscountAmount(p.amount || 0);
          setAppliedItems(p.appliedItems || []);
        }
      }
    } catch (err) {
      // ignore
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(res.data.data?.items || []);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
    setLoading(false);
  };

  const getMaxQuantity = (item: CartItem) => {
    return item.variant_id?.quantity ?? item.product_id?.quantity ?? 99;
  };

  const increaseQuantity = async (
    productId: string,
    variantId: string | null
  ) => {
    const item = cartItems.find(
      (i) =>
        i.product_id?._id === productId &&
        (i.variant_id?._id || null) === variantId
    );

    if (!item) return;
    const newQty = item.quantity + 1;

    setCartItems((prev) =>
      prev.map((i) =>
        i.product_id?._id === productId &&
        (i.variant_id?._id || null) === variantId
          ? { ...i, quantity: newQty }
          : i
      )
    );

    try {
      await axios.put(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
          variant_id: variantId,
          quantity: newQty,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Lỗi tăng số lượng", err);
    }
  };

  const decreaseQuantity = async (
    productId: string,
    variantId: string | null
  ) => {
    const item = cartItems.find(
      (i) =>
        i.product_id?._id === productId &&
        (i.variant_id?._id || null) === variantId
    );

    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;

    setCartItems((prev) =>
      prev.map((i) =>
        i.product_id?._id === productId &&
        (i.variant_id?._id || null) === variantId
          ? { ...i, quantity: newQty }
          : i
      )
    );

    try {
      await axios.put(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
          variant_id: variantId,
          quantity: newQty,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Lỗi giảm số lượng", err);
    }
  };

  const removeItem = async (productId: string, variantId?: string | null) => {
    const previousCart = [...cartItems];

    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.product_id?._id === productId &&
            (i.variant_id?._id || null) === (variantId || null)
          )
      )
    );

    try {
      await axios.delete(`${API_BASE_URL}/cart/items/${productId}`, {
        data: { variant_id: variantId || null },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Lỗi xoá sản phẩm", err);
      setCartItems(previousCart);
    }
  };
  window.dispatchEvent(new Event("cartUpdated"));
  const subtotal = cartItems
    .filter((item) => {
      // Kiểm tra item.product_id có tồn tại trước khi truy cập _id
      if (!item.product_id) return false;
      const key = item.product_id._id + (item.variant_id?._id || "");
      return selectedItems.includes(key);
    })
    .reduce(
      (sum, item) =>
        sum +
        (item.variant_id?.price ?? item.product_id?.price ?? 0) * item.quantity,
      0
    );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }

    const selected = cartItems.filter((item) => {
      if (!item.product_id) return false;
      const key = item.product_id._id + (item.variant_id?._id || "");
      return selectedItems.includes(key);
    });

    if (selected.length === 0) {
      alert("Dữ liệu giỏ hàng không hợp lệ, vui lòng tải lại");
      fetchCart();
      return;
    }

    navigate("/thanhtoan", {
      state: { selectedItems: selected },
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
        onLoginSuccess={fetchCart}
      />
    );
  }

  const toggleSelect = (key: string) => {
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  // Reset discounts when cart contents or selection changes
  useEffect(() => {
    setDiscountAmount(0);
    setAppliedItems([]);
    setCouponError("");
    setApplying(false);
  }, [cartItems.length, selectedItems.join(",")]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-md p-8">
        <div className="flex items-center justify-center mb-10">
          <ShoppingCart className="text-purple-700 w-8 h-8 mr-3" />
          <h1 className="text-3xl font-extrabold text-purple-700">Giỏ Hàng</h1>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-600">
            Đang tải giỏ hàng...
          </p>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600 text-sm uppercase">
                  <th className="p-3 w-[15%]"></th>
                  <th className="p-3 w-[15%]">Ảnh sản phẩm</th>
                  <th className="p-3 text-center w-[15%]">Tên sản phẩm</th>
                  <th className="p-3 text-center w-[15%]">Loại bìa</th>
                  <th className="p-3 text-center w-[15%]">Danh mục</th>
                  <th className="p-3 text-center">Đơn Giá</th>
                  <th className="p-3 text-center w-[15%]">Số lượng</th>
                  <th className="p-3 text-center w-[10%]">Tổng</th>
                  <th className="p-3 text-center w-[10%]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const product = item.product_id;
                  const variant = item.variant_id;

                  // Kiểm tra product có tồn tại trước khi render
                  if (!product) return null;

                  const key = product._id + (variant?._id || "");
                  const price = variant?.price ?? product.price;
                  const maxQty = getMaxQuantity(item);

                  return (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(key)}
                          onChange={() => toggleSelect(key)}
                          className="w-5 h-5 accent-purple-600"
                        />
                      </td>

                      <td className="p-3 flex justify-center">
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          className="w-16 h-16 rounded-xl object-cover"
                          alt={product.name}
                        />
                      </td>

                      <td className="p-3 text-left font-semibold">
                        <span>{product.name}</span>
                      </td>

                      <td>
                        {variant && (
                          <p className="p-3 text-left">{variant.type}</p>
                        )}
                      </td>

                      <td>
                        <p className="p-3 text-left">
                          {product.category?.name || "—"}
                        </p>
                      </td>

                      <td className="p-3 text-center text-purple-700 font-semibold">
                        {(() => {
                          const match = appliedItems.find(
                            (a) => String(a.product_id) === String(product._id)
                          );
                          if (match && match.discountAmount) {
                            const perItemDiscount =
                              match.discountAmount / item.quantity;
                            const discountedPrice = Math.max(
                              0,
                              (price ?? 0) - perItemDiscount
                            );
                            return (
                              <div>
                                <div className="text-sm text-gray-400 line-through">
                                  {(price ?? 0).toLocaleString()} đ
                                </div>
                                <div className="text-purple-700 font-semibold">
                                  {Math.round(discountedPrice).toLocaleString()}{" "}
                                  đ
                                </div>
                              </div>
                            );
                          }
                          return `${(price ?? 0).toLocaleString()} đ`;
                        })()}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                product._id,
                                variant?._id || null
                              )
                            }
                            disabled={item.quantity <= 1}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.quantity <= 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            −
                          </button>

                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                product._id,
                                variant?._id || null
                              )
                            }
                            disabled={item.quantity >= maxQty}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.quantity >= maxQty
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-purple-600 text-white"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="p-3 text-center font-semibold">
                        {(() => {
                          const match = appliedItems.find(
                            (a) => String(a.product_id) === String(product._id)
                          );
                          if (match && match.discountAmount) {
                            return (
                              Math.max(
                                0,
                                (price ?? 0) * item.quantity -
                                  (match.discountAmount || 0)
                              ).toLocaleString() + " đ"
                            );
                          }
                          return (
                            ((price ?? 0) * item.quantity).toLocaleString() +
                            " đ"
                          );
                        })()}
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            removeItem(product._id, variant?._id || null)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-end mt-10">
              <div className="bg-white border rounded-2xl shadow-md p-6 w-80">
                <h2 className="text-lg font-bold text-purple-700 mb-3 text-center">
                  Tạm tính
                </h2>

                {/* Apply coupon */}
                <div className="mb-4">
                  <label className="text-sm text-gray-600">Mã giảm giá</label>
                  <div className="flex gap-2 mt-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!coupon || applying}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        !coupon || applying
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {applying ? "Đang kiểm tra..." : "Áp dụng"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-500 mt-2">{couponError}</p>
                  )}
                  {discountAmount > 0 && (
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-3 bg-purple-600 text-white px-3 py-1 rounded-full">
                        <span className="font-semibold tracking-wide">
                          {(coupon || "").toUpperCase()}
                        </span>
                        <span className="text-sm opacity-90">
                          - {discountAmount.toLocaleString()}đ
                        </span>
                        <button
                          onClick={() => {
                            setCoupon("");
                            setDiscountAmount(0);
                            setAppliedItems([]);
                            setCouponError("");
                            localStorage.removeItem("pending_discount");
                          }}
                          className="ml-2 text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-0.5"
                        >
                          Hủy
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Mã đã áp dụng cho các sản phẩm đã chọn.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-gray-700 mb-4">
                  <span>Tổng sản phẩm đã chọn</span>
                  <span>{(subtotal - discountAmount).toLocaleString()} đ</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={subtotal - discountAmount === 0}
                  className={`w-full py-2.5 rounded-lg font-semibold transition ${
                    subtotal - discountAmount === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
