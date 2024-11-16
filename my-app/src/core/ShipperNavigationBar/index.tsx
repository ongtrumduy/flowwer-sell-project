import { Link, useNavigate } from 'react-router-dom';

import styles from './ShipperNavigationBar.module.scss';
import { AppRoutes } from '@helpers/app.router';
import { Button } from '@mui/material';
import { LoginCurve } from 'iconsax-react';
import AccessApiService from '@services/api/access';
import { InterfaceLogoutResponseMetaData } from '@services/api/access/type';

const ShipperNavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const returnLogout =
        (await AccessApiService.logout()) as InterfaceLogoutResponseMetaData;

      if (returnLogout) {
        navigate(`${AppRoutes.BASE()}${AppRoutes.LOGIN()}`);
      }

      // return returnLogout;
    } catch (error) {
      console.error('show error message ===>', { error });
    }
  };

  return (
    <div className={styles.shipper_sidebar}>
      <h2>Bảng Người giao hàng</h2>
      <ul>
        <li>
          <Link to={`${AppRoutes.SHIPPER_BASE()}/${AppRoutes.SHIPPER_ORDER()}`}>
            Đơn hàng
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

export default ShipperNavigationBar;
