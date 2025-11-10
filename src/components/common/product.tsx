import React from 'react';

type Book = {
    title: string;
    author: string;
    price: string;
    image: string;
};

const selectedBooks: Book[] = [
    {
        title: 'Doraemon Movie 44',
        author: 'Fujiko F Fujio',
        price: '54.000',
        image: 'https://byvn.net/iHJr',
    },
    {
        title: 'Người Đàn Ông Mang Tên OVE',
        author: 'Fredrik Backman',
        price: '134.000',
        image: 'https://byvn.net/qjYt',
    },
    {
        title: "Trường Ca Achilles",
        author: 'Madeline Miller',
        price: '127.500',
        image: 'https://byvn.net/S752',
    },
    {
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        price: '64.500',
        image: 'https://byvn.net/jOt3',
    },
];

const mustBuyBooks: Book[] = [
    {
        title: 'Cây Cam Ngọt Của Tôi',
        author: 'José Mauro de Vasconcelos',
        price: '88.500',
        image: 'https://byvn.net/W2ZF',
    },
    {
        title: 'Hai Số Phận',
        author: 'Jeffrey Archer',
        price: '185.500',
        image: 'https://byvn.net/Zqh6',
    },
    {
        title: 'Thị Trấn Nhỏ, Giấc Mơ Lớn',
        author: 'Fredrik Backman',
        price: '176.000',
        image: 'https://byvn.net/CxfI',
    },
    {
        title: 'Lớp Có Tang Sự',
        author: 'Doo Vandenis',
        price: '204.000',
        image: 'https://byvn.net/s9RZ',
    },
];

const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col">
        <img
            src={book.image}
            alt={book.title}
            className="h-60 w-full object-cover rounded mb-4"
            onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/200x300.png?text=No+Image';
            }}
        />
        <h3 className="font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
        <p className="font-bold text-red-500 mb-3">{book.price} đ</p>
        <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 px-3 rounded mt-auto">
            Thêm vào giỏ hàng
        </button>
    </div>
);

const BookCarousel: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-16">
            <section className="bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 md:text-left">
                        <span className="inline-block border border-purple-300 text-purple-500 text-xs px-3 py-1 rounded-full">
                            Truyện Doraemon mới nhất
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Fujiko F. Fujio
                        </h1>

                        <p className="text-gray-600">
                            Doraemon, được sáng tạo bởi Fujiko F. Fujio, là một trong những bộ manga nổi tiếng nhất mọi thời đại. Bộ truyện đã được xuất bản từ năm 1969 và được chuyển thể thành phim hoạt hình, với hơn 40 phim điện ảnh. Doraemon đã trở thành biểu tượng văn hóa của Nhật Bản và được yêu thích trên toàn thế giới với những câu chuyện về tình bạn, khoa học viễn tưởng và những bài học ý nghĩa...
                        </p>

                        <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-5 py-2 rounded transition md:ml-0 md:mr-auto block">
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
                                className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto md:mx-0 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://via.placeholder.com/400x300.png?text=No+Banner";
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/80 to-transparent p-4">
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    <span className="text-white font-semibold">Sách có chữ ký tác giả</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 text-left">Lựa chọn cho bạn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {selectedBooks.map((book, index) => (
                        <BookCard key={index} book={book} />
                    ))}
                </div>
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-2 h-2 rounded-full bg-[#4f0f87]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 text-left">Có thể mua ngay</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {mustBuyBooks.map((book, index) => (
                        <BookCard key={index} book={book} />
                    ))}
                </div>
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-2 h-2 rounded-full bg-[#4f0f87]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
            </section>

            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Bạn có biết về chúng tôi không?</h2>
                        <p className="text-gray-600 mb-4">
                            Chúng tôi là Bookworld - chuyên về sách trực tuyến và mục tiêu của chúng tôi là
                            mang đến những cuốn sách có thể thay đổi cuộc sống của bạn hoặc đưa bạn thoát
                            khỏi thế giới thực để bước vào một thế giới tuyệt vời hơn. Bookora tự hào được
                            hợp tác với những nhà xuất bản nổi tiếng nhất để mang lại trải nghiệm tốt nhất
                            cho bạn.
                            <br /><br />
                            Nếu bạn yêu thích sách, hãy đăng ký nhận bản tin của chúng tôi!
                        </p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="w-full bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#51348f]"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 rounded"
                            >
                                Đăng ký
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <a href="https://facebook.com/bookworld" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-[#1877F2] text-white px-6 py-3 rounded-lg hover:bg-[#1864D6] transition-all duration-200 shadow-md">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                            </svg>
                            <span className="font-medium">Theo dõi Fanpage BookWorld</span>
                        </a>

                        <div className="mt-4 w-full bg-gray-100 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">
                                Fanpage: <span className="font-semibold">BookWorld - Thế Giới Sách</span>
                                <br />
                                Nhấn vào nút để truy cập Facebook và tham gia cộng đồng của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookCarousel;