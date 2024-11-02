import { CATEGORY_API } from '@services/constant';
import AxiosConfigService from '@services/axios';
import { InterfaceCategoryList } from './type';

class CategoryApiService {
  // ===========================================================================
  // get all category list
  static getAllCategoryList = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: CATEGORY_API.ALL(),
      })
        .then((data: unknown) => {
          // console.log('23 data getAllCategoryList ===>', data);
          const categoryListData = data as InterfaceCategoryList;

          resolve(categoryListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default CategoryApiService;
