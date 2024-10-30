import LocalStorageService from '@services/local-storage';
import { EnumLocalStorage } from '@services/local-storage/type';
import { InterfaceAuthInformationMetaData } from '@utils/type';
import { useEffect, useMemo, useState } from 'react';

export default function useGetAuthInformationMetaData() {
  // ----------------------------------------------------------------
  // ------------------------------------------------------------------
  const [authInformationMetaData, setMetaDataAuthInformation] = useState<InterfaceAuthInformationMetaData>(() => {
    const authTokenReturnValue = LocalStorageService.getItem({
      key: EnumLocalStorage.AUTH_INFORMATION,
    });

    return authTokenReturnValue;
  });
  const [accessToken, setAccessToken] = useState('');

  // ----------------------------------------------------------------
  // ------------------------------------------------------------------
  const isAuthenticated = useMemo(() => {
    return authInformationMetaData?.tokens?.accessToken;
  }, [authInformationMetaData?.tokens?.accessToken]);

  const userInformation = useMemo(() => {
    return authInformationMetaData?.user;
  }, [authInformationMetaData?.user]);

  // ----------------------------------------------------------------
  // ------------------------------------------------------------------
  const handleSetNewAuthInformation = () => {
    const newAuthInformation = LocalStorageService.getItem({
      key: EnumLocalStorage.AUTH_INFORMATION,
    });
    // console.log('35 setAuthInformation ===>');

    setMetaDataAuthInformation(newAuthInformation);
  };

  // ----------------------------------------------------------------
  // ------------------------------------------------------------------
  useEffect(() => {
    window.addEventListener('storage', handleSetNewAuthInformation);

    return window.removeEventListener('storage', handleSetNewAuthInformation);
  }, []);

  useEffect(() => {
    if (!authInformationMetaData?.tokens?.accessToken) {
      //   console.log('50 no access token ===>');
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }

      LocalStorageService.removeItem({ key: EnumLocalStorage.AUTH_INFORMATION });

      return;
    }

    setAccessToken(authInformationMetaData?.tokens?.accessToken);
  }, [authInformationMetaData?.tokens?.accessToken]);

  return { authInformationMetaData, isAuthenticated, userInformation, accessToken };
}
