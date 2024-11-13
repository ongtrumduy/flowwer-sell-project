import { Outlet, RouteProps } from 'react-router';
import ShipperNavigationBar from '../../core/ShipperNavigationBar';

import styles from './ShipperLayout.module.scss';
import clsx from 'clsx';

const ShipperLayout: React.FC<RouteProps> = () => {
  return (
    <div className={styles.shipper_layout_wrapper}>
      <ShipperNavigationBar />

      <div className={clsx('ml-4', styles.shipper_layout_wrapper)}>
        <Outlet />
      </div>
    </div>
  );
};

export default ShipperLayout;
