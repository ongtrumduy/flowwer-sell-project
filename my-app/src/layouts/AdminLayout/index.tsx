import { Outlet, RouteProps } from 'react-router';
import AdminNavigationBar from '../../core/AdminNavigationBar';

import styles from './AdminLayout.module.scss';
import clsx from 'clsx';

const AdminLayout: React.FC<RouteProps> = () => {
  return (
    <div className={styles.admin_layout_wrapper}>
      <AdminNavigationBar />

      <div className={clsx('ml-4', styles.admin_layout_content)}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
