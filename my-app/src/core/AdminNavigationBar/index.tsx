import { Link, useNavigate } from 'react-router-dom';

import styles from './AdminNavigationBar.module.scss';
import { AppRoutes } from '@helpers/app.router';
import { Button } from '@mui/material';
import { LoginCurve } from 'iconsax-react';
import { InterfaceLogoutResponseMetaData } from '@services/api/access/type';
import AccessApiService from '@services/api/access';

const AdminNavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const returnLogout =
        (await AccessApiService.logout()) as InterfaceLogoutResponseMetaData;

      if (returnLogout) {
        navigate(`${AppRoutes.BASE()}/${AppRoutes.LOGIN()}`);
      }

      // return returnLogout;
    } catch (error) {
      console.error('show error message ===>', { error });
    }
  };

  return (
    <div className={styles.admin_sidebar}>
      <h2>Bảng Quản trị viên</h2>
      <ul>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_DASHBOARD()}`}>
            Thống kê
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_ACCOUNT()}`}>
            Tài khoản
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_PRODUCT()}`}>
            Sản phẩm{' '}
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_ORDER()}`}>
            Đơn hàng
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_CATEGORY()}`}>
            Danh mục
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_VOUCHER()}`}>
            Mã giảm giá
          </Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_SETTING()}`}>
            Thiết lập
          </Link>
        </li>
      </ul>
      <Button
        color="inherit"
        sx={{
          color: '#ffffff',
        }}
        onClick={handleLogout}
      >
        <LoginCurve size="32" color="#ffffff" />
        &nbsp;Đăng xuất
      </Button>
    </div>
  );
};

export default AdminNavigationBar;
