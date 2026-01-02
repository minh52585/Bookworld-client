import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api';

interface Voucher {
  _id: string;
  code: string;
  title?: string;
  description?: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  usedCount?: number;
  startAt?: string;     // ISO string for comparisons
  startRaw?: string;    // original admin raw string for display
  expireAt?: string;    // ISO string for comparisons
  expireRaw?: string;   // original admin raw string for display
  createdAt?: string;
  createdRaw?: string;
}

interface Props {
  onApply?: (code: string) => void;
}

const formatDate = (d?: string | null) => {
  if (!d) return 'Không giới hạn';
  try {
    return new Date(d).toLocaleDateString();
  } catch (err) {
    return 'Không xác định';
  }
};

const isExpired = (expireAt?: string) => {
  if (!expireAt) return false;
  return new Date(expireAt) < new Date();
};

const isUnavailable = (v?: Voucher) => {
  if (!v) return false;
  if (v.usageLimit && (v.usedCount || 0) >= v.usageLimit) return true;
  return isExpired(v.expireAt);
};

const displayDate = (raw?: string | undefined, iso?: string | undefined) => {
  if (raw && typeof raw === 'string' && /[\/\-]/.test(raw)) return raw;
  if (iso) {
    try {
      return new Date(iso).toLocaleDateString();
    } catch (err) {
      return 'Không xác định';
    }
  }
  return 'Không giới hạn';
};

const PromotionsList: React.FC<Props> = ({ onApply }) => {
  const [promos, setPromos] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Voucher | null>(null);

  const normalizeVoucher = (p: any): Voucher => {
    const get = (keys: string[]) => {
      for (const k of keys) {
        if (p && p[k] !== undefined && p[k] !== null) return p[k];
      }
      return undefined;
    };

    const toIso = (v: any) => {
      if (!v) return undefined;
      if (typeof v === 'number') return new Date(v).toISOString();
      try {
        return new Date(v).toISOString();
      } catch (err) {
        return undefined;
      }
    };

    const rawStart = get([
  'startsAt',
  'startAt',
  'start_date',
  'startDate',
  'from'
]);

const rawExpire = get([
  'endsAt',
  'expireAt',
  'end_date',
  'endDate',
  'to'
]);
    const rawCreated = get(['createdAt', 'created_at']);

    return {
  _id: get(['_id', 'id']) || '',
  code: String(get(['code']) || ''),

  // ✅ FIX TIÊU ĐỀ & MÔ TẢ
  title: String(get(['title']) || ''),
  description: String(get(['description']) || ''),

  type: get(['type']) === 'fixed' ? 'fixed' : 'percent',
  value: Number(get(['value']) || 0),

  minOrderValue: Number(get(['minOrderValue']) || 0) || undefined,
  usageLimit: Number(get(['totalUsageLimit']) || 0) || undefined,
  usedCount: Number(get(['usedCount']) || 0) || undefined,

  startAt: toIso(get(['startsAt'])),
  expireAt: toIso(get(['endsAt'])),
};
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/discounts?status=active`);
        const raw = res.data?.data?.items || res.data?.data || [];
        const mapped = (raw || []).map((r: any) => normalizeVoucher(r));
        setPromos(mapped);
      } catch (err) {
        console.error('Không lấy được khuyến mãi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div>Đang tải khuyến mãi...</div>;

  if (!promos.length)
    return <div className="text-gray-500">Không có khuyến mãi đang hoạt động.</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p) => (
          <div key={p._id} className={`relative rounded-lg p-4 border ${isUnavailable(p) ? 'bg-gray-50 opacity-60' : 'bg-white shadow'}`}>
            {isUnavailable(p) && (
              <div className="absolute top-3 right-3 bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-md text-sm">Đã hết</div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-purple-600 font-semibold tracking-wide">
                  {p.code}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {p.type === 'percent' ? `${p.value}%` : `${(p.value || 0).toLocaleString()}đ`}
                </div>
                {(() => {
                  const expired = isUnavailable(p);
                  return (
                    <p className={`text-xs mt-2 ${expired ? 'text-red-500' : 'text-gray-400'}`}>
                      {p.startAt || p.createdAt ? `Áp dụng: ${formatDate(p.startAt || p.createdAt)} — Hết hạn: ${formatDate(p.expireAt)}` : `Hạn dùng: ${formatDate(p.expireAt)}`}
                      {expired && <span className="ml-2 font-semibold">(Đã hết)</span>}
                    </p>
                  );
                })()}
              </div>

              <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                {(() => {
                  const expired = isUnavailable(p);
                  return (
                    <button
                      onClick={() => onApply?.(p.code)}
                      disabled={expired}
                      className={`${expired ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} px-3 py-1 rounded font-medium`}
                    >
                      {expired ? 'Đã hết' : 'Áp dụng'}
                    </button>
                  );
                })()}


              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-purple-600">{selected.code}</h2>
                {selected.title && (
  <p className="text-gray-600 text-sm mt-1">{selected.title}</p>
)}
              </div>

              {(isExpired(selected.expireAt) || (selected.usageLimit && (selected.usedCount || 0) >= selected.usageLimit)) && (
                <span className="text-red-500 text-sm font-semibold">Đã hết</span>
              )}
            </div>

            {/* Giá trị giảm */}
            <div className="mt-4 p-4 bg-purple-50 rounded">
              <p className="text-lg font-semibold">
                {selected.type === 'percent' ? `Giảm ${selected.value}%` : `Giảm ${selected.value.toLocaleString()}đ`}
              </p>

              {selected.maxDiscountValue && (
                <p className="text-sm text-gray-600 mt-1">Tối đa {selected.maxDiscountValue.toLocaleString()}đ</p>
              )}
            </div>

            {/* Điều kiện */}
            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <p>
                <b>Đơn tối thiểu:</b>{' '}
                {selected.minOrderValue ? `${selected.minOrderValue.toLocaleString()}đ` : 'Không yêu cầu'}
              </p>

              <p>
                <b>Số lượt sử dụng:</b>{' '}
                {selected.usageLimit ? `${selected.usedCount || 0}/${selected.usageLimit}` : 'Không giới hạn'}
              </p>

              <p>
                <b>Thời gian áp dụng:</b><br />
                {formatDate(selected.startAt || selected.createdAt)} → {formatDate(selected.expireAt)}
              </p>
            </div>

            {/* Mô tả */}
            <div className="mt-4">
              <p className="font-semibold">Mô tả</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.description || 'Không có mô tả'}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded hover:bg-gray-50">Đóng</button>

              <button
                disabled={isExpired(selected.expireAt) || (selected.usageLimit && (selected.usedCount || 0) >= selected.usageLimit)}
                onClick={() => {
                  onApply?.(selected.code);
                  setSelected(null);
                }}
                className={`px-4 py-2 rounded text-white ${isExpired(selected.expireAt) || (selected.usageLimit && (selected.usedCount || 0) >= selected.usageLimit) ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                Áp dụng mã
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionsList;
