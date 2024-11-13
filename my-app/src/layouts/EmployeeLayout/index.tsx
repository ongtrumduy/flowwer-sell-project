import { Outlet, RouteProps } from 'react-router';
import EmployeeNavigationBar from '../../core/EmployeeNavigationBar';

import styles from './EmployeeLayout.module.scss';
import clsx from 'clsx';

const EmployeeLayout: React.FC<RouteProps> = () => {
  return (
    <div className={styles.employee_layout_wrapper}>
      <EmployeeNavigationBar />

      <div className={clsx('ml-4', styles.employee_layout_content)}>
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
