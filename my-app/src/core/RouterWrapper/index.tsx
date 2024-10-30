import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import { EnumRole } from '@utils/type';
import { Navigate } from 'react-router';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useGetAuthInformationMetaData();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const ProtectedRoleRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole: EnumRole }) => {
  const { accessToken, userInformation } = useGetAuthInformationMetaData();

  if (!accessToken && !userInformation) return <Navigate to="/login" />;

  if (!userInformation.roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const VerifiedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, userInformation } = useGetAuthInformationMetaData();

  if (accessToken && userInformation) return <Navigate to="/home" />;

  return children;
};
