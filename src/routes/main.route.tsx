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
import SearchPage from "../pages/SearchPage";  // <-- thêm dòng này

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
    ],
  },
]);
