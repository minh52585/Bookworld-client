import React, { useState } from "react";
import { XCircle } from "lucide-react";

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

const CANCEL_REASONS = [
  "Đặt nhầm sản phẩm",
  "Muốn thay đổi sản phẩm",
  "Thời gian giao hàng quá lâu",
  "Tìm được giá tốt hơn",
  "Lý do khác",
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  if (!open) return null;
  const handleSubmit = async  () => {
    if (!reason) return;

    const finalNote =
      reason === "Lý do khác"
        ? `Lý do hủy: ${note}`
        : note
        ? `Lý do hủy: ${reason}\nGhi chú: ${note}`
        : `Lý do hủy: ${reason}`;

    try {
      setLoading(true);
      setError(null);

      await onConfirm(finalNote); // ⬅️ CHỜ backend

      setReason("");
      setNote("");
      onClose();
    } catch (err: any) {
      setError(
        err?.message || "Không thể hủy đơn ở trạng thái hiện tại"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">Vui lòng chọn lí do hủy đơn hàng</h3>

        <div className="space-y-2 mb-4">
          {CANCEL_REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="cancelReason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        {reason === "Lý do khác" && (
          <textarea
            className="w-full border rounded-lg p-2 mb-4"
            rows={3}
            placeholder="Nhập lý do hủy..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Đóng
          </button>

          <button
            disabled={!reason}
            className={`px-4 py-2 rounded-lg text-white ${
              reason
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
