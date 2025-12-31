import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// Hàm bỏ dấu tiếng Việt
const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // 1) Gọi API
        const res = await axios.get(`${API_BASE_URL}/products`);

        // 2) Lấy đúng mảng sản phẩm từ backend
        const all = res.data?.data?.items ?? [];

        // 3) Chuẩn hoá từ khoá tìm kiếm
        const q = removeVietnameseTones(query.toLowerCase().trim());

        // 4) Lọc theo name
        const filtered = all.filter((p: any) => {
          const title = removeVietnameseTones(
            (p.name ?? "").toLowerCase()
          );
          return title.includes(q);
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [query]);

  if (loading) return <div className="p-5">Đang tìm kiếm...</div>;

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold mb-3">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-purple-600">{query}</span>
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((item: any) => (
            <div
              key={item._id}
              className="border p-3 rounded shadow"
            >
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0].url
                    : "/no-image.png"
                }
                className="w-full h-40 object-cover rounded mb-2"
              />

              <p className="font-medium">{item.name}</p>

              <p className="text-red-600 font-bold">
                {item.price.toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
