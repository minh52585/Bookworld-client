const Footer = () => {
    return (
        <footer className="bg-purple-400 text-white py-8 px-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Logo and Social */}
                <div className="flex flex-col justify-between">
                    <div className="font-bold text-xl">B-World</div>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-white text-2xl"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-white text-2xl"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-white text-2xl"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>

                {/* Categories, For Kids, E-Books, Help & Contacts */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-8">
                    {/* Categories */}
                    <div>
                        <h3 className="font-bold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li><a className="text-white" href="#">Psychology</a></li>
                            <li><a className="text-white" href="#">Self-Help</a></li>
                            <li><a className="text-white" href="#">Romance</a></li>
                            <li><a className="text-white" href="#">Mystery</a></li>
                        </ul>
                    </div>
                    {/* For Kids */}
                    <div>
                        <h3 className="font-bold mb-4">For kids</h3>
                        <ul className="space-y-2">
                            <li><a className="text-white" href="#">Games</a></li>
                            <li><a className="text-white" href="#">Comics</a></li>
                            <li><a className="text-white" href="#">Fantasy</a></li>
                        </ul>
                    </div>
                    {/* E-Books */}
                    <div>
                        <h3 className="font-bold mb-4">E-Books</h3>
                        <ul className=" text-white space-y-2">
                            <li><a className="text-white" href="#">Fiction</a></li>
                            <li><a className="text-white" href="#">Historical</a></li>
                            <li><a className="text-white" href="#">Horror</a></li>
                        </ul>
                    </div>
                    {/* Help & Contacts */}
                    <div>
                        <h3 className="font-bold mb-4">Help & Contacts</h3>
                        <ul className="space-y-2 text-sm">
                            <li><i className="text-white fas fa-phone mr-2"></i> +445 87 999 000</li>
                            <li><i className="text-white fas fa-clock mr-2"></i> Mo-Fri, 9 AM to 11 PM</li>
                            <li><i className="text-white fas fa-envelope mr-2"></i> b.world@store.ro</li>
                        </ul>
                    </div>
                </div>

                {/* Contact & Payment */}
                <div className="flex flex-col gap-8">
                    <p className="text-white text-lg mb-4">
                        If you have questions, <br />
                        you can contact us or <br />
                        we will do it for you.
                    </p>
                    <button className="border border-white text-black py-3 px-6 text-lg hover:bg-white hover:text-purple-400 transition rounded">
                        Request a call
                    </button>
                    <div className="flex space-x-4 mt-4">
                        <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mt-8 border-t border-white pt-4">
                <div className="text-sm text-center w-full">
                    © All copyrights are reserved. B-World 2022.
                </div>
            </div>
        </footer>

    );
};

export default Footer;