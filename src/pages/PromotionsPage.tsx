import React, { useState } from 'react';
import PromotionsList from '../components/common/PromotionsList';

import { useNavigate } from 'react-router-dom';
import { showNotification } from '../utils/notification';

const PromotionsPage = () => {
  const nav = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleApply = (code: string) => {
    try {
      localStorage.setItem('pending_discount', JSON.stringify({ code }));
      showNotification(`Mã ${code} đã được copy và áp dụng.`, 'success');
      nav('/thanhtoan');
    } catch (err) {
      console.error('Không thể áp dụng mã:', err);
      showNotification('Không thể áp dụng mã.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Banner - try public file first, fallback to styled gradient */}
      <div className="w-full rounded-lg overflow-hidden mb-6">
        {!imgError ? (
          <img
            src="/img/promotions-banner.jpg"
            alt="Khuyến mãi tháng"
            onError={() => setImgError(true)}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-tr from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white">
            <div className="text-center px-4">
              <h2 className="text-3xl sm:text-4xl font-bold">Giảm đến <span className="text-yellow-300">70%</span></h2>
              <p className="mt-2 font-semibold">XẢ KHO - MUA ĐI CHỜ CHI</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-600">Khuyến mãi tháng</h1>
          <p className="text-sm text-gray-600">Các mã khuyến mãi đang hoạt động. Nhấn "Áp dụng" để sử dụng mã trong thanh toán.</p>
        </div>
        <div>
          <a href="#promos" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Xem khuyến mãi</a>
        </div>
      </div>

      <div id="promos">
        <PromotionsList onApply={handleApply} />
      </div>
    </div>
  );
};

export default PromotionsPage;
