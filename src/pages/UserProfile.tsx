import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../configs/api";
import { showNotification } from "../utils/notification";
import { Modal, Descriptions } from "antd";
const UserProfile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [page] = useState(1);
  const [bankCards, setBankCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewWithdrawInfo, setPreviewWithdrawInfo] = useState<null | {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>(null);
  const [cardForm, setCardForm] = useState({
    bankName: "Vietcombank",
    accountNumber: "",
    accountName: "",
    isDefault: false,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    createdAt: "",
    status: ""
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const limit = 20;
  const TRANSACTION_SIGN: Record<string, "+" | "-"> = {
    "Nạp tiền": "+",
    "Hoàn tiền": "+",
    "Thanh toán": "-",
    "Rút tiền": "-",
  };
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchWalletBalance();
      fetchTransactions();
      fetchBankCards();
    }
  }, [isAuthenticated, navigate]);

  const formatOrderIdShort = (text?: string) => {
    if (!text) return "";

    return text.replace(/\b[a-f0-9]{24}\b/gi, (id) => `#${id.slice(-8)}`);
  };
  useEffect(() => {
    if (isAuthenticated && activeTab === "info") {
      fetchUserInfo();
    }
  }, [isAuthenticated, activeTab]);

  const fetchUserInfo = async () => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/me/infor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;
      setProfileForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        avatar: data.avatar || "",
        createdAt: data.createdAt || "",
        status: data.status || ""
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchWalletBalance = async () => {
    setLoadingWallet(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setWalletBalance(response.data.data.balance || 0);
      }
    } catch (error: any) {
      console.error("Lỗi lấy số dư ví:", error);
      if (error.response?.status === 401) {
        showNotification(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
          "error"
        );
        logout();
        navigate("/login");
      }
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/walletTransaction/my-transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
          },
        }
      );

      if (response.data?.data) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchBankCards = async () => {
    setLoadingCards(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/withdrawalMethod`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data) {
        setBankCards(response.data.data);
        const defaultCard = response.data.data.find((c: any) => c.isDefault);
        if (defaultCard) setSelectedCard(defaultCard._id);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách thẻ:", error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleDeposit = async () => {
    const amount = parseInt(depositAmount);

    if (!amount || amount <= 0) {
      showNotification("Vui lòng nhập số tiền hợp lệ!", "error");
      return;
    }

    if (amount < 10000) {
      showNotification("Số tiền nạp tối thiểu là 10,000đ!", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        "error"
      );
      navigate("/login");
      return;
    }

    setLoadingDeposit(true);

    try {
      console.log("📦 Đang tạo lệnh nạp tiền:", { amount });

      const response = await axios.post(
        `${API_BASE_URL}/walletTransaction/create`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response nạp tiền:", response.data);

      if (response.data.success && response.data.data.paymentUrl) {
        showNotification("Đang chuyển đến trang thanh toán VNPay...", "info");

        localStorage.setItem(
          "pending_deposit_id",
          response.data.data.balance._id
        );

        window.location.href = response.data.data.paymentUrl;
      } else {
        showNotification(
          "Tạo lệnh nạp tiền thất bại: " +
            (response.data.message || "Lỗi không xác định"),
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Lỗi nạp tiền:", error);

      let errorMsg = "Tạo lệnh nạp tiền thất bại. Vui lòng thử lại!";

      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        errorMsg = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối.";
      } else if (error.response?.status === 401) {
        errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        logout();
        navigate("/login");
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      showNotification(errorMsg, "error");
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      showNotification("Vui lòng nhập số tiền hợp lệ", "error");
      return;
    }

    if (!selectedCard) {
      showNotification("Vui lòng chọn thẻ nhận tiền", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("Phiên đăng nhập đã hết hạn", "error");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/walletTransaction/withdrawal`,
        {
          amount: Number(withdrawAmount),
          withdrawalMethodId: selectedCard,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification("Đã gửi yêu cầu rút tiền, chờ admin duyệt", "success");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể rút tiền",
        "error"
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.name.trim()) {
      showNotification("Vui lòng nhập họ tên!", "error");
      return;
    }

    setLoadingUpdate(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/me/infor`,
        {
          name: profileForm.name,
          // Không gửi email để tránh thay đổi tài khoản đăng nhập
          phone: profileForm.phone,
          address: profileForm.address,
          avatar: profileForm.avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification("Cập nhật thông tin thành công!", "success");
      setIsEditingProfile(false);

      fetchUserInfo();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể cập nhật thông tin",
        "error"
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleAddCard = async (cardData: any) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/withdrawalMethod`,
        {
          bankName: cardData.bankName,
          accountNumber: cardData.accountNumber.replace(/\s/g, ""),
          accountName: cardData.accountName,
          isDefault: cardData.isDefault || false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showNotification("Thêm thẻ thành công!", "success");
        setShowAddCardModal(false);
        fetchBankCards();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể thêm thẻ",
        "error"
      );
    }
  };

  const resetCardForm = () => {
    setCardForm({
      bankName: "Vietcombank",
      accountNumber: "",
      accountName: "",
      isDefault: false,
    });
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa thẻ này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/withdrawalMethod/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("Xóa thẻ thành công!", "success");
      fetchBankCards();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể xóa thẻ",
        "error"
      );
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/withdrawalMethod/${cardId}`,
        { isDefault: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification("Đã đặt thẻ mặc định!", "success");
      fetchBankCards();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Không thể cập nhật",
        "error"
      );
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      navigate("/");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const maskCardNumber = (number: string) => {
    return number.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 **** **** $4");
  };

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const getTransactionTypeLabel = (type: string) => {
    const labels: any = {
      "Nạp tiền": { label: "Nạp tiền", icon: "fa-arrow-down", color: "green" },
      "Rút tiền": { label: "Rút tiền", icon: "fa-arrow-up", color: "blue" },
      "Thanh toán": {
        label: "Thanh toán đơn hàng",
        icon: "fa-shopping-bag",
        color: "purple",
      },
    };
    return labels[type] || { label: type, icon: "fa-exchange", color: "gray" };
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "";
    return new Date(value).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      "Thành công": {
        label: "Hoàn thành",
        class: "bg-green-100 text-green-700",
      },
      "Chờ xử lý": {
        label: "Đang xử lý",
        class: "bg-yellow-100 text-yellow-700",
      },
      "Thất bại": { label: "Thất bại", class: "bg-red-100 text-red-700" },
    };
    return (
      labels[status] || { label: status, class: "bg-gray-100 text-gray-700" }
    );
  };

  const totalDeposit = transactions
    .filter((t) => t.type === "Nạp tiền" && t.status === "Thành công")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === "Rút tiền" && t.status === "Thành công")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPurchase = transactions
    .filter((t) => t.type === "Thanh toán" && t.status === "Thành công")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                {profileForm.avatar ? (
                  <img
                    src={profileForm.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ${
                    profileForm.avatar ? "hidden" : ""
                  }`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                {user.role === "admin" && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold shadow-md">
                    ADMIN
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.fullname || "Người dùng"}
                </h1>
                <p className="text-gray-600 mb-1">
                  <i className="fas fa-envelope mr-2 text-purple-600"></i>
                  {user.email}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                      profileForm.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <i
                      className={`fas ${
                        profileForm.status === "active" ? "fa-wallet" : "fa-lock"
                      }`}
                    ></i>
                    {profileForm.status === "active" ? "Mở" : "Bị khóa"}
                  </span>

                  {/* Ngày tham gia */}
                  <span className="text-gray-500 text-sm">
                    <i className="far fa-calendar mr-1"></i>
                    Tham gia:{" "}
                    {profileForm.createdAt
                      ? new Date(profileForm.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white min-w-[280px] shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">💰 Số dư khả dụng</span>
                <button
                  onClick={fetchWalletBalance}
                  className="text-white/80 hover:text-white"
                  disabled={loadingWallet}
                >
                  <i
                    className={`fas fa-sync-alt ${
                      loadingWallet ? "fa-spin" : ""
                    }`}
                  ></i>
                </button>
              </div>
              <div className="text-3xl font-bold mb-4">
                {loadingWallet ? (
                  <span className="text-xl">Đang tải...</span>
                ) : (
                  formatCurrency(walletBalance)
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <i className="fas fa-arrow-down mr-1"></i>
                  Nạp tiền
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <i className="fas fa-arrow-up mr-1"></i>
                  Rút tiền
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition shadow-md flex items-center space-x-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "wallet"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-wallet mr-2"></i>
              Ví của tôi
            </button>
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "cards"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-credit-card mr-2"></i>
              Thẻ ngân hàng
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "history"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-history mr-2"></i>
              Lịch sử
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "info"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              Thông tin cá nhân
            </button>
            <button
              onClick={() => navigate("/order")}
              className="flex-1 px-6 py-4 font-semibold transition bg-white text-gray-600 hover:bg-purple-50"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Đơn hàng
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* TAB: Ví của tôi */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Quản lý ví điện tử
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                    <div className="text-green-700 font-semibold mb-2">
                      <i className="fas fa-arrow-down mr-2"></i>
                      Tổng nạp
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(totalDeposit)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                    <div className="text-blue-700 font-semibold mb-2">
                      <i className="fas fa-arrow-up mr-2"></i>
                      Tổng rút
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(totalWithdraw)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="text-purple-700 font-semibold mb-2">
                      <i className="fas fa-shopping-bag mr-2"></i>
                      Tổng chi tiêu
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {formatCurrency(totalPurchase)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl font-semibold transition shadow-lg group"
                  >
                    <i className="fas fa-arrow-down text-3xl mb-2 block group-hover:scale-110 transition"></i>
                    <div className="text-lg">Nạp tiền vào ví</div>
                    <div className="text-sm opacity-90 mt-1">
                      Tối thiểu 10,000đ
                    </div>
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl font-semibold transition shadow-lg group"
                  >
                    <i className="fas fa-arrow-up text-3xl mb-2 block group-hover:scale-110 transition"></i>
                    <div className="text-lg">Rút tiền về tài khoản</div>
                    <div className="text-sm opacity-90 mt-1">
                      Tối thiểu 50,000đ
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Thẻ ngân hàng */}
            {activeTab === "cards" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Thẻ ngân hàng của tôi
                  </h2>
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Thêm thẻ mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loadingCards ? (
                    <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
                    </div>
                  ) : bankCards.length === 0 ? (
                    <div className="text-center py-10 col-span-2">
                      <i className="fas fa-credit-card text-6xl text-gray-300 mb-4"></i>
                      <p className="text-gray-600">Chưa có thẻ nào</p>
                    </div>
                  ) : (
                    bankCards.map((card) => (
                      <div key={card._id}>
                        <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 rounded-2xl shadow-2xl">
                          {card.isDefault && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                              <i className="fas fa-star mr-1"></i>
                              Mặc định
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-8">
                            <div className="text-xl font-bold">
                              {card.bankName}
                            </div>
                            <i className="fas fa-credit-card text-3xl"></i>
                          </div>
                          <div className="text-xl tracking-wider mb-4 font-mono">
                            {maskCardNumber(card.accountNumber)}
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <div className="text-xs opacity-70">Chủ thẻ</div>
                              <div className="font-semibold">
                                {card.accountName}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {!card.isDefault && (
                            <button
                              onClick={() => handleSetDefaultCard(card._id)}
                              className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Xóa thẻ
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: Lịch sử giao dịch */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Lịch sử giao dịch
                  </h2>
                  <button
                    onClick={fetchTransactions}
                    disabled={loadingTransactions}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    <i
                      className={`fas fa-sync-alt mr-2 ${
                        loadingTransactions ? "fa-spin" : ""
                      }`}
                    ></i>
                    Làm mới
                  </button>
                </div>

                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                    <div className="text-green-700 font-semibold mb-1 text-sm">
                      <i className="fas fa-arrow-down mr-2"></i>
                      Tổng nạp
                    </div>
                    <div className="text-xl font-bold text-green-800">
                      {formatCurrency(totalDeposit)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="text-blue-700 font-semibold mb-1 text-sm">
                      <i className="fas fa-arrow-up mr-2"></i>
                      Tổng rút
                    </div>
                    <div className="text-xl font-bold text-blue-800">
                      {formatCurrency(totalWithdraw)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="text-purple-700 font-semibold mb-1 text-sm">
                      <i className="fas fa-shopping-bag mr-2"></i>
                      Tổng chi tiêu
                    </div>
                    <div className="text-xl font-bold text-red-700">
                      {formatCurrency(totalPurchase)}
                    </div>
                  </div>
                </div>

                {loadingTransactions ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải giao dịch...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-10">
                    <i className="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600">Chưa có giao dịch nào</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    {/* Desktop View - Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                              <i className="far fa-clock mr-2"></i>
                              Thời gian
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-exchange-alt mr-2"></i>
                              Loại giao dịch
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-money-bill-wave mr-2"></i>
                              Số tiền
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-image mr-2"></i>
                              Thông tin thẻ rút
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-image mr-2"></i>
                              Ảnh giao dịch
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-image mr-2"></i>
                              Ghi chú
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                              <i className="fas fa-info-circle mr-2"></i>
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map((t, index) => {
                            const typeInfo = getTransactionTypeLabel(t.type);
                            const statusInfo = getStatusLabel(t.status);

                            return (
                              <tr
                                key={t._id}
                                className={`hover:bg-gray-50 transition ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                {/* Thời gian */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                      {
                                        formatDateTime(t.createdAt).split(
                                          ", "
                                        )[0]
                                      }
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {
                                        formatDateTime(t.createdAt).split(
                                          ", "
                                        )[1]
                                      }
                                    </span>
                                  </div>
                                </td>

                                {/* Loại giao dịch */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                        typeInfo.color === "green"
                                          ? "bg-green-100"
                                          : typeInfo.color === "blue"
                                          ? "bg-blue-100"
                                          : "bg-purple-100"
                                      }`}
                                    >
                                      <i
                                        className={`fas ${typeInfo.icon} ${
                                          typeInfo.color === "green"
                                            ? "text-green-600"
                                            : typeInfo.color === "blue"
                                            ? "text-blue-600"
                                            : "text-purple-600"
                                        }`}
                                      ></i>
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        {typeInfo.label}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Mã giao dịch: {t._id.slice(-8)}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Số tiền */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div
                                    className={`text-lg font-bold ${
                                      t.type === "Nạp tiền" ||
                                      t.type === "Hoàn tiền"
                                        ? "text-green-600"
                                        : t.type === "Rút tiền"
                                        ? "text-blue-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {t.type === "Nạp tiền" ||
                                    t.type === "Hoàn tiền"
                                      ? "+"
                                      : "-"}
                                    {formatCurrency(t.amount)}
                                  </div>
                                </td>

                                <td className="px-6 py-4 text-center">
                                  {t.type === "Rút tiền" && t.withdrawalMethod ? (
                                    <button
                                        onClick={() =>
                                          setPreviewWithdrawInfo({
                                            bankName: t.withdrawalMethod.bankName,
                                            accountNumber: t.withdrawalMethod.accountNumber,
                                            accountName: t.withdrawalMethod.accountName,
                                          })
                                        }
                                        className="text-indigo-600 hover:text-indigo-800 transition"
                                        title="Xem thông tin rút tiền"
                                      >
                                        <i className="fas fa-credit-card text-lg"></i>
                                      </button>
                                  ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                  )}
                                </td>
                            <Modal
                            open={!!previewWithdrawInfo}
                            onCancel={() => setPreviewWithdrawInfo(null)}
                            footer={null}
                            centered
                            width={420}
                            mask={false}
                            title={
                              <div className="flex items-center gap-2">
                                <i className="fas fa-credit-card text-indigo-600"></i>
                                <span className="font-semibold">Thông tin rút tiền</span>
                              </div>
                            }
                          >
                            {previewWithdrawInfo && (
                              <Descriptions
                                column={1}
                                size="small"
                                bordered
                                labelStyle={{ width: 140 }}
                              >
                                <Descriptions.Item label="Ngân hàng">
                                  {previewWithdrawInfo.bankName}
                                </Descriptions.Item>

                                <Descriptions.Item label="Số tài khoản">
                                  <span className="font-mono font-semibold">
                                    {previewWithdrawInfo.accountNumber}
                                  </span>
                                </Descriptions.Item>

                                <Descriptions.Item label="Chủ tài khoản">
                                  {previewWithdrawInfo.accountName}
                                </Descriptions.Item>
                              </Descriptions>
                            )}
                          </Modal>

                                {/* Ảnh */}
                                <td className="px-6 py-4 text-center">
                                  {t.status === "Thành công" && t.image_transaction ? (
                                   <img
                                    src={t.image_transaction}
                                    alt="Ảnh giao dịch"
                                    className="w-12 h-12 object-cover rounded cursor-pointer mx-auto border hover:scale-105 transition"
                                    onClick={() => setPreviewImage(t.image_transaction)}
                                  />
                                  ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                  )}
                                </td>

                                <td className="px-6 py-4 text-center">
                                  {t.note ?  (
                                   <span className="text-xs">{t.note}</span>
                                  ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                  )}
                                </td>
                                {/* Trạng thái */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.class}`}
                                  >
                                    <i
                                      className={`fas ${
                                        t.status === "Thành công"
                                          ? "fa-check-circle"
                                          : t.status === "Chờ xử lý"
                                          ? "fa-clock"
                                          : "fa-times-circle"
                                      } mr-1`}
                                    ></i>
                                    {statusInfo.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="md:hidden space-y-3 p-4">
                      {transactions.map((t) => {
                        const typeInfo = getTransactionTypeLabel(t.type);
                        const statusInfo = getStatusLabel(t.status);

                        return (
                          <div
                            key={t._id}
                            className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                              <div className="flex items-center">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                                    typeInfo.color === "green"
                                      ? "bg-green-100"
                                      : typeInfo.color === "blue"
                                      ? "bg-blue-100"
                                      : "bg-purple-100"
                                  }`}
                                >
                                  <i
                                    className={`fas ${typeInfo.icon} text-lg ${
                                      typeInfo.color === "green"
                                        ? "text-green-600"
                                        : typeInfo.color === "blue"
                                        ? "text-blue-600"
                                        : "text-purple-600"
                                    }`}
                                  ></i>
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {typeInfo.label}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDateTime(t.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.class}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>

                            {/* Amount */}
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">
                                Số tiền
                              </div>
                              <div
                                className={`text-2xl font-bold ${
                                  t.type === "Nạp tiền" ||
                                  t.type === "Hoàn tiền"
                                    ? "text-green-600"
                                    : t.type === "Rút tiền"
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }`}
                              >
                                {t.type === "Nạp tiền" || t.type === "Hoàn tiền"
                                  ? "+"
                                  : "-"}
                                {formatCurrency(t.amount)}
                              </div>
                            </div>

                            {/* ID */}
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">
                                Mã giao dịch
                              </div>
                              <div className="text-sm font-mono text-gray-700">
                                {t._id.slice(-12)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Thông tin cá nhân */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Thông tin tài khoản
                  </h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Chỉnh sửa thông tin
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          fetchUserInfo();
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Hủy
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loadingUpdate}
                        className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
                          loadingUpdate
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {loadingUpdate ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save mr-2"></i>
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {loadingProfile ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
                    <p className="text-gray-600 mt-4">Đang tải thông tin...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        <i className="fas fa-image mr-2 text-purple-600"></i>
                        Ảnh đại diện
                      </h3>
                      <div className="flex items-center gap-6 flex-wrap">
                        {/* Preview Avatar */}
                        <div className="relative">
                          {profileForm.avatar ? (
                            <img
                              src={profileForm.avatar}
                              alt="Avatar Preview"
                              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ${
                              profileForm.avatar ? "hidden" : ""
                            }`}
                          >
                            {profileForm.name
                              ? profileForm.name.charAt(0).toUpperCase()
                              : user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        </div>

                        {/* Upload Options */}
                        {isEditingProfile && (
                          <div className="flex-1 space-y-3">
                            {/* Option 1: Nhập URL */}
                            <div>
                              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Nhập URL ảnh
                              </label>
                              <input
                                type="text"
                                value={profileForm.avatar}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    avatar: e.target.value,
                                  })
                                }
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                              />
                            </div>

                            {/* Option 2: Upload File */}
                            <div>
                              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Hoặc tải ảnh lên
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      showNotification(
                                        "Ảnh không được vượt quá 2MB!",
                                        "error"
                                      );
                                      return;
                                    }

                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setProfileForm({
                                        ...profileForm,
                                        avatar: reader.result as string,
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, GIF (tối đa 2MB)
                              </p>
                            </div>

                            {/* Remove Avatar Button */}
                            {profileForm.avatar && (
                              <button
                                onClick={() =>
                                  setProfileForm({
                                    ...profileForm,
                                    avatar: "",
                                  })
                                }
                                className="text-sm text-red-600 hover:text-red-700 font-semibold"
                              >
                                <i className="fas fa-trash mr-1"></i>
                                Xóa ảnh đại diện
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Other Info Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Họ và tên */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">
                          <i className="fas fa-user mr-2 text-purple-600"></i>
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Nhập họ và tên"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-800">
                            {profileForm.name ||
                              user.fullname ||
                              "Chưa cập nhật"}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">
                          <i className="fas fa-envelope mr-2 text-purple-600"></i>
                          Email (Tài khoản đăng nhập)
                        </label>
                        <p className="text-lg font-medium text-gray-800">
                          {profileForm.email || user.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <i className="fas fa-lock mr-1"></i>
                          Email không thể thay đổi vì đây là tài khoản đăng nhập
                        </p>
                      </div>

                      {/* Số điện thoại */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">
                          <i className="fas fa-phone mr-2 text-purple-600"></i>
                          Số điện thoại
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-800">
                            {profileForm.phone ||
                              user.fullphone ||
                              "Chưa cập nhật"}
                          </p>
                        )}
                      </div>

                      {/* Vai trò */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">
                          <i className="fas fa-shield-alt mr-2 text-purple-600"></i>
                          Vai trò
                        </label>
                        <p className="text-lg font-medium text-gray-800">
                          {user.role === "admin"
                            ? "Quản trị viên"
                            : "Thành viên"}
                        </p>
                      </div>

                      {/* Địa chỉ */}
                      <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">
                          <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                          Địa chỉ
                        </label>
                        {isEditingProfile ? (
                          <textarea
                            value={profileForm.address}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Nhập địa chỉ đầy đủ"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-800">
                            {profileForm.address || "Chưa cập nhật"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Link
            to="/cart"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mua sắm
                </h3>
                <p className="text-gray-600 text-sm">Khám phá sản phẩm</p>
              </div>
              <div className="text-3xl text-purple-600 group-hover:scale-110 transition">
                <i className="fas fa-book"></i>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Hỗ trợ
                </h3>
                <p className="text-gray-600 text-sm">Liên hệ với chúng tôi</p>
              </div>
              <div className="text-3xl text-purple-600 group-hover:scale-110 transition">
                <i className="fas fa-headset"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Nạp tiền */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-wallet mr-2 text-purple-600"></i>
                Nạp tiền vào ví
              </h3>
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <i className="fas fa-info-circle"></i>
                <span className="font-semibold">Thanh toán qua VNPay</span>
              </div>
              <p className="text-sm text-blue-600">
                Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao
                dịch
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền nạp (tối thiểu 10,000đ)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(amt.toString())}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {amt / 1000}K
                </button>
              ))}
            </div>

            <button
              onClick={handleDeposit}
              disabled={loadingDeposit}
              className={`w-full py-3 rounded-lg font-semibold shadow-md transition ${
                loadingDeposit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              }`}
            >
              {loadingDeposit ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2"></i>
                  Tiếp tục thanh toán VNPay
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Rút tiền */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-hand-holding-usd mr-2 text-blue-600"></i>
                Rút tiền về tài khoản
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg mb-6 border-2 border-purple-300">
              <div className="text-sm text-purple-700 mb-1">Số dư khả dụng</div>
              <div className="text-2xl font-bold text-purple-800">
                {formatCurrency(walletBalance)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rút về thẻ
              </label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">-- Chọn thẻ nhận tiền --</option>
                {bankCards.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.bankName} - {maskCardNumber(c.accountNumber)} -{" "}
                    {c.accountName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền rút (tối thiểu 50,000đ)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickAmounts.slice(0, 3).map((amt) => (
                <button
                  key={amt}
                  onClick={() => setWithdrawAmount(amt.toString())}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {amt / 1000}K
                </button>
              ))}
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-info-circle mr-1"></i>
                Phí rút: 0đ | Thời gian: 1-3 ngày làm việc
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loadingWithdraw}
              className={`w-full py-3 rounded-lg font-semibold shadow-md transition ${
                loadingWithdraw
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
              }`}
            >
              {loadingWithdraw ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2"></i>
                  Xác nhận rút tiền
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Thêm thẻ */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                <i className="fas fa-credit-card mr-2 text-purple-600"></i>
                Thêm thẻ ngân hàng
              </h3>
              <button
                onClick={() => {
                  setShowAddCardModal(false);
                  resetCardForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngân hàng <span className="text-red-500">*</span>
                </label>
                <select
                  value={cardForm.bankName}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, bankName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option>Vietcombank</option>
                  <option>TPBank</option>
                  <option>Techcombank</option>
                  <option>VietinBank</option>
                  <option>BIDV</option>
                  <option>MB Bank</option>
                  <option>ACB</option>
                  <option>Agribank</option>
                  <option>Sacombank</option>
                  <option>VPBank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardForm.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardForm({ ...cardForm, accountNumber: value });
                  }}
                  placeholder="Nhập số tài khoản"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhập số tài khoản ngân hàng (chỉ số)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên chủ tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardForm.accountName}
                  onChange={(e) =>
                    setCardForm({
                      ...cardForm,
                      accountName: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="NGUYEN VAN A"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhập đúng tên trên tài khoản ngân hàng (viết hoa, không dấu)
                </p>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardForm.isDefault}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, isDefault: e.target.checked })
                  }
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Đặt làm thẻ mặc định
                </span>
              </label>
            </div>

            <button
              onClick={() => {
                if (!cardForm.bankName) {
                  showNotification("Vui lòng chọn ngân hàng!", "error");
                  return;
                }

                if (
                  !cardForm.accountNumber ||
                  cardForm.accountNumber.length < 8
                ) {
                  showNotification(
                    "Số tài khoản không hợp lệ (tối thiểu 8 số)!",
                    "error"
                  );
                  return;
                }

                if (
                  !cardForm.accountName ||
                  cardForm.accountName.trim().length < 3
                ) {
                  showNotification("Tên chủ tài khoản không hợp lệ!", "error");
                  return;
                }

                handleAddCard(cardForm);
                resetCardForm();
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow-md mt-6 transition"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Thêm thẻ ngân hàng
            </button>
          </div>
        </div>
      )}
      {previewImage && (
  <div
    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
    onClick={() => setPreviewImage(null)}
  >
    <div
      className="relative bg-white rounded-xl max-w-3xl w-full p-4 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={() => setPreviewImage(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
      >
        <i className="fas fa-times text-xl"></i>
      </button>

      {/* Image */}
      <div className="flex items-center justify-center">
        <img
          src={previewImage}
          alt="Ảnh giao dịch"
          className="max-h-[75vh] w-auto object-contain rounded-lg"
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">
        <a
          href={previewImage}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          <i className="fas fa-external-link-alt mr-1"></i>
          Mở tab mới
        </a>

        <a
          href={previewImage}
          download
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <i className="fas fa-download mr-1"></i>
          Tải ảnh
        </a>
      </div>
    </div>
  </div>
)}

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default UserProfile;
