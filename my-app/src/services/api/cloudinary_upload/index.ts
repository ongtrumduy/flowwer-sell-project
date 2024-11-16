import AxiosConfigService from '@services/axios';
import { CLOUDINARY_UPLOAD_API } from '@services/constant';
import { InterfaceCloudinaryUploadData } from './type';
import { AxiosHeaders } from 'axios';

class CloudinaryUploadApiService {
  // ===========================================================================
  // get all product list
  static uploadProfileAvatarImage = ({ formData }: { formData: FormData }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: CLOUDINARY_UPLOAD_API.UPLOAD(),
        data: formData,
        customHeaders: headers,
      })
        .then((data: unknown) => {
          const cloudinaryUploadData = data as InterfaceCloudinaryUploadData;

          resolve(cloudinaryUploadData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default CloudinaryUploadApiService;
