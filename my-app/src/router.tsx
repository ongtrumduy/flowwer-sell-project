import React from 'react';

import { AppRoutes } from './helpers/app.router';

import AppLayout from './layouts/AppLayout';
import EmptyLayout from './layouts/EmptyLayout';

import AdminLayout from '@layouts/AdminLayout';
import EmployeeLayout from '@layouts/EmployeeLayout';
import ShipperLayout from '@layouts/ShipperLayout';
import ForgotPasswordPage from '@pages/AccessPage/ForgotPassword';
import LoginPage from '@pages/AccessPage/Login';
import SignUpPage from '@pages/AccessPage/SignUp';
import AdminAccountPage from '@pages/AdminPage/AdminAccount';
import AdminCategoryPage from '@pages/AdminPage/AdminCategory';
import AdminOrderPage from '@pages/AdminPage/AdminOrder';
import AdminOverviewPage from '@pages/AdminPage/AdminOverview';
import AdminProductPage from '@pages/AdminPage/AdminProduct';
import AdminTypeProductPage from '@pages/AdminPage/AdminTypeProduct';
import UserProfilePage from '@pages/CommonPage/UserProfile';
import ShipperOrderPage from '@pages/ShipperPage/ShipperOrder';
import CartPage from '@pages/UserPage/Cart';
import CompletionPage from '@pages/UserPage/Completion';
import ImageUploadPage from '@pages/UserPage/ImageUpload';
import OrderPage from '@pages/UserPage/Order';
import OrderDetailPage from '@pages/UserPage/OrderDetail';
import ProductDetailPage from '@pages/UserPage/ProductDetail';
import StripePaymentPage from '@pages/UserPage/StripePayment';
import { EnumRole } from '@utils/type';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoleRoute, VerifiedUserRoute } from './core/RouterWrapper';
import NotFoundPage from './pages/CommonPage/NotFound';
import HomePage from './pages/UserPage/Home';
import EmployeeOrderPage from '@pages/EmployeePage/EmployeeOrder';
import ShipperOrderDetailPage from '@pages/ShipperPage/ShipperOrderDetail';

// import './utils/register-aliases';

const RootRouter = React.memo(() => {
  return (
    <Routes>
      {/* // ================================================================================================= */}
      <Route path={AppRoutes.PAGE_NOT_FOUND()} element={<EmptyLayout />}>
        <Route index element={<NotFoundPage />} />
      </Route>
      <Route path={AppRoutes.PAGE_UNAUTHORIZED()} element={<EmptyLayout />}>
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
      <Route path={AppRoutes.FORGOT_PASSWORD()} element={<EmptyLayout />}>
        <Route
          index
          element={
            <VerifiedUserRoute>
              <ForgotPasswordPage />
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
            <ProtectedRoleRoute requiredRole={[EnumRole.USER, EnumRole.GUEST]}>
              <HomePage />
            </ProtectedRoleRoute>
          }
        />
        {/* // ------------------------------------------------------------------------ */}
        <Route
          path={AppRoutes.HOME()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER, EnumRole.GUEST]}>
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
          path={AppRoutes.PAYMENT({})}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
              <StripePaymentPage />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path={AppRoutes.PAYMENT({}) + '/' + AppRoutes.COMPLETION()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
              <CompletionPage />
            </ProtectedRoleRoute>
          }
        />
        <Route
          path={AppRoutes.IMAGE_UPLOAD()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER]}>
              <ImageUploadPage />
            </ProtectedRoleRoute>
          }
        />
        {/* // ------------------------------------------------------------------------ */}

        {/* // ------------------------------------------------------------------------ */}
        <Route
          path={AppRoutes.PRODUCT_DETAIL({})}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.USER, EnumRole.GUEST]}>
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
              <AdminOverviewPage />
            </ProtectedRoleRoute>
          }
        />
        {/* // ------------------------------------------------------------------------ */}
        <Route
          path={AppRoutes.ADMIN_OVERVIEW()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
              <AdminOverviewPage />
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
        />{' '}
        <Route
          path={AppRoutes.ADMIN_TYPE_PRODUCT()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
              <AdminTypeProductPage />
            </ProtectedRoleRoute>
          }
        />
        {/* <Route
          path={AppRoutes.ADMIN_SETTING()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.ADMIN]}>
              <AdminSettingPage />
            </ProtectedRoleRoute>
          }
        /> */}
        {/* // ------------------------------------------------------------------------ */}
        {/* // ------------------------------------------------------------------------ */}
        {/* <Route
            path="/product-detail/:productId"
            element={
              <ProtectedRoleRouteADMIN_SETTING
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
              <EmployeeOrderPage />
            </ProtectedRoleRoute>
          }
        />
        {/* <Route
          path={AppRoutes.EMPLOYEE_OVERVIEW()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.EMPLOYEE]}>
              <EmployeeOverviewPage />
            </ProtectedRoleRoute>
          }
        /> */}
        {/* // ------------------------------------------------------------------------ */}
        <Route
          path={AppRoutes.EMPLOYEE_ORDER()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.EMPLOYEE]}>
              <EmployeeOrderPage />
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
          path={AppRoutes.SHIPPER_ORDER()}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.SHIPPER]}>
              <ShipperOrderPage />
            </ProtectedRoleRoute>
          }
        />

        <Route
          path={AppRoutes.SHIPPER_ORDER_DETAIL({})}
          element={
            <ProtectedRoleRoute requiredRole={[EnumRole.SHIPPER]}>
              <ShipperOrderDetailPage />
            </ProtectedRoleRoute>
          }
        />
        {/* // ------------------------------------------------------------------------ */}

        {/* // ------------------------------------------------------------------------ */}

        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {/* // ================================================================================================= */}
    </Routes>
  );
});

export default RootRouter;
