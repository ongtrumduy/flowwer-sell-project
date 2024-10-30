import LocalStorageService from '@services/local-storage';
import { EnumLocalStorage } from '@services/local-storage/type';
import { InterfaceAuthInformationMetaData } from '@utils/type';

class AuthInformationMetadataService {
  static getAccessToken = () => {
    const authInformation = LocalStorageService.getItem({ key: EnumLocalStorage.AUTH_INFORMATION }) as InterfaceAuthInformationMetaData;

    return authInformation?.tokens?.accessToken;
  };

  static getUserInformation = () => {
    const authInformation = LocalStorageService.getItem({ key: EnumLocalStorage.AUTH_INFORMATION }) as InterfaceAuthInformationMetaData;

    return authInformation?.user;
  };

  static getRefreshToken = () => {
    const authInformation = LocalStorageService.getItem({ key: EnumLocalStorage.AUTH_INFORMATION }) as InterfaceAuthInformationMetaData;

    return authInformation?.tokens?.refreshToken;
  };

  static getUserId = () => {
    const userInformation = AuthInformationMetadataService.getUserInformation();

    return userInformation?.userId;
  };
}

export default AuthInformationMetadataService;
