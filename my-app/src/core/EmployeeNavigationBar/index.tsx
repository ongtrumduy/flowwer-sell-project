import { Link, useNavigate } from 'react-router-dom';

import styles from './EmployeeNavigationBar.module.scss';
import { AppRoutes } from '@helpers/app.router';
import { LoginCurve } from 'iconsax-react';
import { Button } from '@mui/material';
import { InterfaceLogoutResponseMetaData } from '@services/api/access/type';
import AccessApiService from '@services/api/access';

const EmployeeNavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const returnLogout = (await AccessApiService.logout()) as InterfaceLogoutResponseMetaData;

      if (returnLogout) {
        navigate(`${AppRoutes.BASE()}${AppRoutes.LOGIN()}`);
      }

      // return returnLogout;
    } catch (error) {
      console.error('show error message ===>', { error });
    }
  };

  return (
    <div className={styles.employee_sidebar}>
      <h2>Bảng Nhân viên</h2>
      <ul>
        <li>
          <Link to={`${AppRoutes.EMPLOYEE_BASE()}/${AppRoutes.EMPLOYEE_ORDER()}`}>Đơn hàng</Link>
        </li>
        <li>
          <Link to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.EMPLOYEE_PRODUCT()}`}>Sản phẩm</Link>
        </li>
        {/* <li>
          <Link
            to={`${AppRoutes.EMPLOYEE_VOUCHER()}/${AppRoutes.EMPLOYEE_VOUCHER()}`}
          >
            Mã giảm giá
          </Link>
        </li> */}
        <li>
          <Link to={`${AppRoutes.EMPLOYEE_BASE()}/${AppRoutes.EMPLOYEE_CATEGORY()}`}>Danh mục</Link>
        </li>
        {/* <li>
          <Link
            to={`${AppRoutes.ADMIN_BASE()}/${AppRoutes.ADMIN_PRODUCT_TYPE()}`}
          >
            Loại sản phẩm
          </Link>
        </li> */}
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

export default EmployeeNavigationBar;
