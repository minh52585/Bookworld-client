import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductDetail from "../pages/productdetail";
import Cart from "../components/common/cart";
import Thanhtoan from "../components/common/thanhtoan";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OrderList from "../pages/order/order";
import OrderDetailPage from "../pages/order/orderDetail";
import SearchPage from "../pages/SearchPage";
import FavoritesPage from "../pages/FavoritePage";
import UserProfile from "../pages/UserProfile";
import AllProducts from "../components/common/AllProductPage";
import PromotionsPage from "../pages/PromotionsPage";
import CategoryPage from "../components/common/CategoryPage";
import VerifyEmailPage from "../pages/Auth/VerifyEmailPage";
import ContactInfo from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "thanhtoan",
        element: <Thanhtoan />,
      },
      {
        path: "order",
        element: <OrderList />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "favorite",
        element: <FavoritesPage />,
      },
      {
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "allproducts",
        element: <AllProducts />,
      },
      {
        path: "promotions",
        element: <PromotionsPage />,
      },
      {
        path: "categories/:id",
        element: <CategoryPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "contact",
        element: <ContactInfo />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
]);
