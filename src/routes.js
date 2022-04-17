import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Settings from './pages/Settings';
import CategoryList from './pages/category/CategoryList';
import CreateCategory from './pages/category/CreateCategory';
import EditCategory from './pages/category/EditCategory';
import ProductList from './pages/product/ProductList';
import AddProduct from './pages/product/AddProduct';
import EditProduct from './pages/product/EditProduct';
import OrderList from './pages/order/OrderList';
import ViewOrder from './pages/order/ViewOrder';
import ReportOrder from './pages/report/ReportOrder';
import UserList from './pages/user/UserList';
import EditUser from './pages/user/EditUser';

const routes = [
  {
    path: 'management',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'user', element: <UserList /> },
      { path: 'user/:userId/edit', element: <EditUser /> },
      { path: 'category', element: <CategoryList /> },
      { path: 'category/create', element: <CreateCategory /> },
      { path: 'category/:categoryId/edit', element: <EditCategory /> },
      { path: 'product', element: <ProductList /> },
      { path: 'product/add', element: <AddProduct /> },
      { path: 'product/:productId/edit', element: <EditProduct /> },
      { path: 'order/', element: <OrderList /> },
      { path: 'order/:orderId', element: <ViewOrder /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'setting', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'report',
    element: <DashboardLayout />,
    children: [
      { path: 'order', element: <ReportOrder /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/management/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
