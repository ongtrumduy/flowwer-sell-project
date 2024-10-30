import React from 'react';
import { Route, Routes } from 'react-router';

import { AppRoutes } from './helpers/app.router';

import AppLayout from './layouts/AppLayout';
import EmptyLayout from './layouts/EmptyLayout';

import LoginPage from '@pages/Login';
import ProductDetailPage from '@pages/ProductDetail';
import SignUpPage from '@pages/SignUpPage';
import { BrowserRouter } from 'react-router-dom';
import { VerifiedUserRoute } from './core/RouterWrapper';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';

// import './utils/register-aliases';

export const RootRouter = React.memo(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.PAGE_NOT_FOUND()} element={<EmptyLayout />}>
          <Route index element={<NotFoundPage />} />
        </Route>

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

        <Route path={AppRoutes.BASE()} element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/home"
            element={<HomePage />}
            //   errorElement={<ErrorBoundary />}
          />
          <Route path="/product-detail/:productId" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
});
