import React from 'react';
import { Route, Routes } from 'react-router';

import { AppRoutes } from './helpers/app.router';

import AppLayout from './layouts/AppLayout';
import EmptyLayout from './layouts/EmptyLayout';

import PaymentPage from '@components/UserComponent/Payment';
import AdminLayout from '@layouts/AdminLayout';
import AdminDashboardPage from '@pages/AdminPage/AdminDashboard';
import LoginPage from '@pages/AuthPage/Login';
import SignUpPage from '@pages/AuthPage/SignUp';
import CartPage from '@pages/UserPage/Cart';
import OrderPage from '@pages/UserPage/Order';
import OrderDetailPage from '@pages/UserPage/OrderDetail';
import ProductDetailPage from '@pages/UserPage/ProductDetail';
import { EnumRole } from '@utils/type';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoleRoute, VerifiedUserRoute } from './core/RouterWrapper';
import NotFoundPage from './pages/CommonPage/NotFound';
import HomePage from './pages/UserPage/Home';
import AdminCategoryPage from '@pages/AdminPage/AdminCategory';
import AdminProductPage from '@pages/AdminPage/AdminProduct';
import AdminOrderPage from '@pages/AdminPage/AdminOrder';
import AdminAccountPage from '@pages/AdminPage/AdminAccount';
import AdminSettingPage from '@pages/AdminPage/AdminSetting';
import UserProfilePage from '@pages/CommonPage/UserProfile';
import ShipperLayout from '@layouts/ShipperLayout';
import EmployeeLayout from '@layouts/EmployeeLayout';
import ShipperOrderPage from '@pages/ShipperPage/ShipperOrderList';

// import './utils/register-aliases';

export const RootRouter = React.memo(() => {
  return (
    <BrowserRouter>
      <Routes>
        {/* // ================================================================================================= */}
        <Route path={AppRoutes.PAGE_NOT_FOUND()} element={<EmptyLayout />}>
          <Route index element={<NotFoundPage />} />
        </Route>
        {/* // ================================================================================================= */}

        {/* // ================================================================================================= */}
        <Route path={AppRoutes.LOGIN()} element={<EmptyLayout />}>
          <Route
            index
            element={
              <VerifiedUserRoute>
                <LoginPage />
              </VerifiedUserRoute>
            }
          />
        </Route>

        <Route path={AppRoutes.SIGN_UP()} element={<EmptyLayout />}>
          <Route
            index
            element={
              <VerifiedUserRoute>
                <SignUpPage />
              </VerifiedUserRoute>
            }
          />
        </Route>
        {/* // ================================================================================================= */}

        {/* // ================================================================================================= */}
        <Route
          path={AppRoutes.BASE()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER, EnumRole.GUEST]}>
              <AppLayout />
            </ProtectedRoleRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <HomePage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}
          <Route
            path={AppRoutes.HOME()}
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <HomePage />
              </ProtectedRoleRoute>
            }
            //   errorElement={<ErrorBoundary />}
          />
          <Route
            path={AppRoutes.CART()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <CartPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ORDER()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <OrderPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.PAYMENT()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <PaymentPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}

          {/* // ------------------------------------------------------------------------ */}
          <Route
            path={AppRoutes.PRODUCT_DETAIL({})}
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <ProductDetailPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ORDER_DETAIL({})}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <OrderDetailPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.USER_PROFILE({})}
            element={
              <ProtectedRoleRoute
                requiredRole={[
                  EnumRole.USER,
                  EnumRole.ADMIN,
                  EnumRole.SHIPPER,
                  EnumRole.EMPLOYEE,
                ]}
              >
                <UserProfilePage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* // ================================================================================================= */}

        {/* // ================================================================================================= */}
        <Route
          path={AppRoutes.ADMIN_BASE()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoleRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminDashboardPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminDashboardPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ADMIN_CATEGORY()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminCategoryPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ADMIN_PRODUCT()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminProductPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ADMIN_ORDER()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminOrderPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ADMIN_ACCOUNT()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminAccountPage />
              </ProtectedRoleRoute>
            }
          />
          <Route
            path={AppRoutes.ADMIN_SETTING()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminSettingPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}

          {/* // ------------------------------------------------------------------------ */}
          {/* <Route
            path="/product-detail/:productId"
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <ProductDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* <Route
            path="/order-detail/:orderId"
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <OrderDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* // ------------------------------------------------------------------------ */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* // ================================================================================================= */}

        {/* // ================================================================================================= */}
        <Route
          path={AppRoutes.EMPLOYEE_BASE()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.EMPLOYEE]}>
              <EmployeeLayout />
            </ProtectedRoleRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.EMPLOYEE]}>
                <AdminDashboardPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}
          <Route
            path={AppRoutes.ADMIN_CATEGORY()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
                <AdminCategoryPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}

          {/* // ------------------------------------------------------------------------ */}
          {/* <Route
            path="/product-detail/:productId"
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <ProductDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* <Route
            path="/order-detail/:orderId"
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <OrderDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* // ------------------------------------------------------------------------ */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* // ================================================================================================= */}

        {/* // ================================================================================================= */}
        <Route
          path={AppRoutes.SHIPPER_BASE()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.SHIPPER]}>
              <ShipperLayout />
            </ProtectedRoleRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.SHIPPER]}>
                <ShipperOrderPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}
          <Route
            path={AppRoutes.ADMIN_CATEGORY()}
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.SHIPPER]}>
                <ShipperOrderPage />
              </ProtectedRoleRoute>
            }
          />
          {/* // ------------------------------------------------------------------------ */}

          {/* // ------------------------------------------------------------------------ */}
          {/* <Route
            path="/product-detail/:productId"
            element={
              <ProtectedRoleRoute
                requiredRole={[EnumRole.USER, EnumRole.GUEST]}
              >
                <ProductDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* <Route
            path="/order-detail/:orderId"
            element={
              <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
                <OrderDetailPage />
              </ProtectedRoleRoute>
            }
          /> */}
          {/* // ------------------------------------------------------------------------ */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* // ================================================================================================= */}
      </Routes>
    </BrowserRouter>
  );
});
