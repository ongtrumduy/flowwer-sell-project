import { Outlet, RouteProps } from 'react-router';
import NavigationBar from '../../core/NavigationBar';

import styles from './AppLayout.module.scss';

const AppLayout: React.FC<RouteProps> = () => {
  return (
    <div className={styles.app_layout_wrapper}>
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
