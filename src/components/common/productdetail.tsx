import React, { useState } from 'react';

const BookDetailPage: React.FC = () => {
  

    return (
        <>
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột trái: Ảnh biến thể và ảnh chính */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    {/* Biến thể (thumbnails) bên trái */}
                    <div className="flex md:flex-col gap-2 md:mr-4">
                        <img src="https://picsum.photos/80/112?random=2" alt="Book 1" className="w-20 h-28 object-cover border cursor-pointer rounded" />
                        <img src="https://picsum.photos/80/112?random=3" alt="Book 2" className="w-20 h-28 object-cover border cursor-pointer rounded" />
                        <img src="https://picsum.photos/80/112?random=4" alt="Book 3" className="w-20 h-28 object-cover border cursor-pointer rounded" />
                    </div>
                    {/* Ảnh sản phẩm chính */}
                    <div className="w-[300px] h-[450px]">
                        <img
                            src="https://picsum.photos/300/450?random=1"
                            alt="Chain of Gold"
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                </div>
                {/* Cột phải: Thông tin sách */}
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Chain of Gold: The Last Hours #1</h2>
                    <p className="text-gray-600 mb-4">Cassandra Clare</p>
                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400 text-xl mr-2">
                            ★★★★☆
                        </div>
                        <span>4.5</span>
                    </div>

                    <div className="text-2xl font-bold mb-4">$12.49</div>

                    <p className="text-gray-700 mb-6">
                        From #1 New York Times and USA TODAY bestselling author Cassandra Clare comes the first novel in a brand-new trilogy...
                    </p>

                    <div className="flex items-center mb-6">
                        <button
                            className="border px-2 py-1 mr-2"
                            //onClick={handleDecrease}
                            //disabled={quantity <= 1}
                        >-</button>
                        {/* <span>{quantity}</span> */}
                        <button
                            className="border px-2 py-1 ml-2"
                            // onClick={handleIncrease}
                        >+</button>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button className="bg-purple-400 text-white py-2 px-4 rounded hover:bg-purple-500">Add to cart</button>
                        <button className="border border-purple-400 text-purple-400 py-2 px-4 rounded hover:bg-purple-400 hover:text-white transition">Favorite</button>
                    </div>
                    <hr className="my-4 border-t-2 border-gray-300" />

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p><span className="font-size-200 font-semibold">Publisher:</span> Margaret K. Books</p>
                            <p><span className="font-semibold">Language:</span> English</p>
                            <p><span className="font-semibold">Print length:</span> 592 pages</p>
                        </div>
                        <div>
                            <p><span className="font-semibold">Publication date:</span> March 3, 2020</p>
                            <p><span className="font-semibold">Reading age:</span> 14+</p>
                            <p><span className="font-semibold">Dimensions:</span> 6 × 1.8 × 9 inches</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                <h3 className="text-2xl font-semibold mb-6">Đánh giá</h3>

                <div className="flex items-start mb-6">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Nguyễn Cường"
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="text-yellow-400 mr-2">★★★★★</div>
                            <span className="text-gray-500 text-sm">30 phút trước</span>
                        </div>
                        <p className="font-semibold">Nguyễn Cường</p>
                        <span>Sách này hay quá!</span>
                    </div>
                </div>
                <div className="flex items-start mb-6">
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Ngọc Hạ"
                        className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="text-yellow-400 mr-2">★★★★☆</div>
                            <span className="text-gray-500 text-sm">1 giờ trước</span>
                        </div>
                        <p className="font-semibold">Ngọc Hạ</p>
                        <span>Truyện hấp dẫn, rất thích!</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetailPage;