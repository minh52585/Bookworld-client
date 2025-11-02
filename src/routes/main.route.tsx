import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductDetail from "../components/common/productdetail";
import Cart from "../components/common/cart";
import Thanhtoan from "../components/common/thanhtoan";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OrderList from "../pages/order/order";
import OrderDetailPage from "../pages/order/orderDetail";

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
        path: "product/:id",
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
        path: "Register",
        element: <Register />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
    ],
  },
]);