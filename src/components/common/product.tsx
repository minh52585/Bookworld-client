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
                            Tác giả của tháng Tám
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Eric-Emmanuel Schmitt
                        </h1>

                        <p className="text-gray-600">
                            Eric-Emmanuel Schmitt đã được trao hơn 20 giải thưởng và danh hiệu văn học. Vào năm 2001, ông được phong danh hiệu Chevalier des Arts et des Lettres - Hiệp sĩ Nghệ thuật và Văn học. Các cuốn sách của ông đã được dịch ra hơn 40 ngôn ngữ...
                        </p>

                        <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-5 py-2 rounded transition md:ml-0 md:mr-auto block">
                            Xem ngay
                        </button>
                    </div>

                    <div className="text-center md:text-right relative">
                        <p className="text-xs uppercase text-gray-500 mb-2">
                            Sách có chữ ký + giảm giá 30%
                        </p>
                        <img
                            src="#"
                            className="w-20 max-w-xs md:max-w-md lg:max-w-lg mx-auto md:mx-0 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://via.placeholder.com/400x300.png?text=No+Banner";
                            }}
                        />
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
                            Chúng tôi là Bookora - chuyên về sách trực tuyến và mục tiêu của chúng tôi là
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

                    <div>
                        <img
                            src="https://via.placeholder.com/600x400/EEE6FA/5C2D91?text=B-World+Map"
                            alt="Map"
                            className="w-full h-auto rounded shadow"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://via.placeholder.com/600x400.png?text=No+Map";
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookCarousel;