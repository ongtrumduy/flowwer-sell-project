import AxiosConfigService from '@services/axios';
import { OVERVIEW_API } from '@services/constant';

class OverviewApiService {
  // ===========================================================================
  // create order for customer
  static overviewDashboardCountInformation = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: OVERVIEW_API.OVERVIEW(),
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create order for customer
  static getOrdersByMonth = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: OVERVIEW_API.GET_ORDERS_BY_MONTH(),
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create order for customer
  static getRevenueByMonth = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: OVERVIEW_API.GET_REVENUE_BY_MONTH(),
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create order for customer
  static getUsersByMonth = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: OVERVIEW_API.GET_USERS_BY_MONTH(),
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default OverviewApiService;
