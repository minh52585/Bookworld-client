import React, { useState, useEffect } from 'react';

type Book = {
    _id?: string;
    id?: string;
    title: string;
    author: string;
    price: number | string;
    image: string;
    category?: string;
    description?: string;
};

const API_BASE_URL = 'http://localhost:5004/api';

const BookCard = ({ book }: { book: Book }) => {
    const formatPrice = (price: number | string) => {
        const numPrice =
            typeof price === 'string'
                ? parseFloat(price.replace(/\./g, ''))
                : price;
        return new Intl.NumberFormat('vi-VN').format(numPrice);
    };

    return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col transition-all duration-300">
            <img
                src={book.image}
                alt={book.title}
                className="h-60 w-full object-cover rounded mb-4"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                        'https://via.placeholder.com/200x300.png?text=No+Image';
                }}
            />
            <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            <p className="font-bold text-red-500 mb-3">{formatPrice(book.price)} đ</p>
            <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 px-3 rounded mt-auto transition-colors duration-200">
                Thêm vào giỏ hàng
            </button>
        </div>
    );
};

const BookCarousel: React.FC = () => {
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [mustBuyBooks, setMustBuyBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_BASE_URL}/products?limit=8`,
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();

                let products: any[] = [];
                if (Array.isArray(data)) products = data;
                else if (data.data?.items) products = data.data.items;
                else if (data.items) products = data.items;
                else if (data.products) products = data.products;

                const mapped = products.map((p) => ({
                    _id: p._id,
                    title: p.name,
                    author: p.author ?? 'Không rõ tác giả',
                    price: p.price,
                    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
                    category: p.category,
                    description: p.description,
                }));

                if (mapped.length > 0) {
                    setSelectedBooks(mapped.slice(0, 4));
                    setMustBuyBooks(mapped.slice(4, 8));
                } else {
                    throw new Error('Không có sản phẩm từ API');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Không thể kết nối server';
                setError(errorMessage);

                // fallback demo data
                setSelectedBooks([
                    { title: 'Doraemon Movie 44', author: 'Fujiko F Fujio', price: '54000', image: 'https://cdn0.fahasa.com/media/catalog/product/d/o/doraemon-movie-44_bia_final.jpg' },
                    { title: 'Người Đàn Ông Mang Tên OVE', author: 'Fredrik Backman', price: '134000', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg' },
                    { title: 'Trường Ca Achilles', author: 'Madeline Miller', price: '127500', image: 'https://cdn0.fahasa.com/media/catalog/product/t/r/truong_ca_achilles_1_2018_10_19_10_37_38.jpg' },
                    { title: 'Nhà Giả Kim', author: 'Paulo Coelho', price: '64500', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/45/3b/fc/aa81d0ad72c714c5d8d31c61dc3f11d0.jpg' },
                ]);
                setMustBuyBooks([
                    { title: 'Cây Cam Ngọt Của Tôi', author: 'José Mauro de Vasconcelos', price: '88500', image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935235226272.jpg' },
                    { title: 'Hai Số Phận', author: 'Jeffrey Archer', price: '185500', image: 'https://cdn0.fahasa.com/media/catalog/product/h/a/hai_so_phan_tb_2022.jpg' },
                    { title: 'Thị Trấn Nhỏ, Giấc Mơ Lớn', author: 'Fredrik Backman', price: '176000', image: 'https://salt.tikicdn.com/cache/w1200/ts/product/b6/c0/21/b6c021e2d0cb7be50a34b86c57e9e964.jpg' },
                    { title: 'Lớp Có Tang Sự', author: 'Doo Vandenis', price: '204000', image: 'https://cdn0.fahasa.com/media/catalog/product/l/o/lop-co-tang-su.jpg' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4f0f87] border-t-transparent"></div>
                <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-16">
            {/* === BANNER GIỮ NGUYÊN === */}
            <section className="bg-white py-12 px-4 rounded-lg shadow-sm">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 md:text-left">
                        <span className="inline-block border border-purple-300 text-purple-500 text-xs px-3 py-1 rounded-full">
                            Truyện Doraemon mới nhất
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Fujiko F. Fujio
                        </h1>
                        <p className="text-gray-600 leading-relaxed">
                            Doraemon, được sáng tạo bởi Fujiko F. Fujio, là một trong những bộ manga nổi tiếng nhất...
                        </p>
                        <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-6 py-3 rounded transition-colors duration-200 shadow-md hover:shadow-lg">
                            Đặt trước ngay
                        </button>
                    </div>
                    <div className="text-center md:text-right relative group">
                        <div className="absolute -top-6 right-4 z-10 bg-red-500 text-white px-6 py-2 rounded-full transform -rotate-2 shadow-lg animate-bounce">
                            <span className="text-sm font-bold whitespace-nowrap">GIẢM GIÁ 30%</span>
                        </div>
                        <div className="relative overflow-hidden rounded-lg mt-8">
                            <img
                                src="https://masterihomes.com.vn/wp-content/uploads/2025/08/sach-doraemon-hoat-hinh-mau-nobita-va-vien-bao-tang-bao-boi-pdf.png"
                                alt="Doraemon"
                                className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto md:mx-0 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://via.placeholder.com/400x300.png?text=No+Banner";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* === Sách lựa chọn cho bạn === */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-left">Lựa chọn cho bạn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {selectedBooks.map((book, index) => (
                        <BookCard key={book._id || book.id || index} book={book} />
                    ))}
                </div>
            </section>

            {/* === Sách có thể mua ngay === */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-left">Có thể mua ngay</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {mustBuyBooks.map((book, index) => (
                        <BookCard key={book._id || book.id || index} book={book} />
                    ))}
                </div>
            </section>
            <section> 
                <h2 className="text-2xl font-bold mb-6 text-left">Có thể mua ngay</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"> {mustBuyBooks.map((book, index) => ( <BookCard key={book._id || book.id || index} book={book} /> ))} </div>
                  <div className="flex justify-center space-x-2 mt-6"> <div className="w-2 h-2 rounded-full bg-[#4f0f87]">
                    </div> 
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                     <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      </div>
                       </section>
                       <section>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"> 
                            <div>
                                 <h2 className="text-2xl font-bold mb-4">Bạn có biết về chúng tôi không?</h2> 
                                 <p className="text-gray-600 mb-4 leading-relaxed"> Chúng tôi là Bookworld - chuyên về sách trực tuyến và mục tiêu của chúng tôi là mang đến những cuốn sách có thể thay đổi cuộc sống của bạn hoặc đưa bạn thoát khỏi thế giới thực để bước vào một thế giới tuyệt vời hơn. Bookworld tự hào được hợp tác với những nhà xuất bản nổi tiếng nhất để mang lại trải nghiệm tốt nhất cho bạn. <br />
                                 <br /> Nếu bạn yêu thích sách, hãy đăng ký nhận bản tin của chúng tôi! </p> 
                                 <div className="space-y-4"> <input type="email" placeholder="Nhập email của bạn" className="w-full bg-white border border-gray-400 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#51348f] focus:border-transparent" />
                                  <button onClick={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký!'); }} className="w-full bg-[#4f0f87] hover:bg-[#51348f] text-white py-3 rounded transition-colors duration-200 shadow-md hover:shadow-lg" > Đăng ký </button> 
                                  </div>
                                   </div> 
                                   <div className="flex flex-col items-center justify-center space-y-4"> 
                                    <a href="https://facebook.com/bookworld" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-[#1877F2] text-white px-6 py-3 rounded-lg hover:bg-[#1864D6] transition-all duration-200 shadow-md hover:shadow-lg w-full justify-center" >
                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> 
                                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                         </svg>
                                          <span className="font-medium">Theo dõi Fanpage BookWorld</span> 
                                          </a>
                                           <div className="w-full bg-gray-100 p-4 rounded-lg text-center"> 
                                            <p className="text-sm text-gray-600"> Fanpage: <span className="font-semibold">BookWorld - Thế Giới Sách</span>
                                             <br /> Nhấn vào nút để truy cập Facebook và tham gia cộng đồng của chúng tôi. </p>
                                              </div>
                                               </div>
                                                </div>
                                                 </section>
        </div>
    );
};

export default BookCarousel;
