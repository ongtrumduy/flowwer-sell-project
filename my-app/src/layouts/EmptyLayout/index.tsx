import { Outlet, RouteProps } from 'react-router';
import styles from './EmptyLayout.module.scss';

const EmptyLayout: React.FC<RouteProps> = () => {
  return (
    <div className={styles.empty_layout_wrapper}>
      <Outlet />
    </div>
  );
};

export default EmptyLayout;
