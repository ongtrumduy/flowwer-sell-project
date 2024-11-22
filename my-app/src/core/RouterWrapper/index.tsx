import { AppRoutes } from '@helpers/app.router';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import { EnumRole } from '@utils/type';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useGetAuthInformationMetaData();

  return isAuthenticated ? children : <Navigate to={`${AppRoutes.BASE()}${AppRoutes.LOGIN()}`} />;
};

export const ProtectedRoleRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole: string[] }) => {
  const { accessToken, userInformation } = useGetAuthInformationMetaData();

  // if (requiredRole.indexOf(EnumRole.GUEST) > -1) {
  //   if (userInformation.role_list.indexOf(EnumRole.ADMIN) > -1) {
  //     return <Navigate to={`${AppRoutes.ADMIN_BASE()}`} />;
  //   }

  //   if (userInformation.role_list.indexOf(EnumRole.SHIPPER) > -1) {
  //     return <Navigate to={`${AppRoutes.SHIPPER_BASE()}`} />;
  //   }

  //   if (userInformation.role_list.indexOf(EnumRole.EMPLOYEE) > -1) {
  //     return <Navigate to={`${AppRoutes.EMPLOYEE_BASE()}`} />;
  //   }

  //   if (userInformation.role_list.indexOf(EnumRole.USER) > -1) {
  //     return <Navigate to={`${AppRoutes.BASE()}`} />;
  //   }
  // }

  if (requiredRole.indexOf(EnumRole.GUEST) > -1 || !requiredRole.length) {
    return children;
  }

  if (!accessToken && !userInformation) return <Navigate to={`${AppRoutes.BASE()}${AppRoutes.LOGIN()}`} />;

  if (
    !userInformation.role_list.some((role) => {
      return requiredRole.indexOf(role) > -1;
    })
  ) {
    if (userInformation.role_list.indexOf(EnumRole.ADMIN) > -1 && requiredRole.indexOf(EnumRole.ADMIN) > -1) {
      return <Navigate to={`${AppRoutes.ADMIN_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.SHIPPER) > -1 && requiredRole.indexOf(EnumRole.SHIPPER) > -1) {
      return <Navigate to={`${AppRoutes.SHIPPER_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.EMPLOYEE) > -1 && requiredRole.indexOf(EnumRole.EMPLOYEE) > -1) {
      return <Navigate to={`${AppRoutes.EMPLOYEE_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.USER) > -1 && requiredRole.indexOf(EnumRole.USER) > -1) {
      return <Navigate to={`${AppRoutes.BASE()}`} />;
    }

    return <Navigate to={`${AppRoutes.PAGE_UNAUTHORIZED()}`} />;
  }

  return children;
};

export const VerifiedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, userInformation } = useGetAuthInformationMetaData();

  if (accessToken && userInformation) {
    if (userInformation.role_list.indexOf(EnumRole.ADMIN) > -1) {
      return <Navigate to={`${AppRoutes.ADMIN_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.SHIPPER) > -1) {
      return <Navigate to={`${AppRoutes.SHIPPER_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.EMPLOYEE) > -1) {
      return <Navigate to={`${AppRoutes.EMPLOYEE_BASE()}`} />;
    }

    if (userInformation.role_list.indexOf(EnumRole.USER) > -1) {
      return <Navigate to={`${AppRoutes.BASE()}`} />;
    }

    return <Navigate to={`${AppRoutes.BASE()}${AppRoutes.HOME()}`} />;
  }

  return children;
};
