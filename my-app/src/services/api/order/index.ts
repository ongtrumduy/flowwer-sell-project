import AxiosConfigService from '@services/axios';
import { ORDER_API } from '@services/constant';

class OrderApiService {
  // ===========================================================================
  // create order for customer
  static createOrderForCustomer = ({
    delivery_address,
    order_item_list,
    total_amount,
  }: {
    delivery_address: string;
    order_item_list: {
      productId: string;
      product_quantity: number;
      product_price_now: number;
    }[];
    total_amount: number;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ORDER_API.CREATE(),
        data: {
          delivery_address,
          order_item_list,
          total_amount,
        },
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
  static getOrderInformationToPayment = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_ORDER_INFORMATION_TO_PAYMENT({ orderId }),
        // params: {
        //   orderId,
        // },
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
  static updatePaymentSuccessOrder = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ORDER_API.UPDATE_SUCCESS_PAYMENT(),
        params: {
          orderId,
        },
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
  //
  static getAllOrderOfCustomerList = ({
    page,
    limit,
    orderStatus,
  }: {
    page: number;
    limit: number;
    orderStatus: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_ALL_ORDER_OF_CUSTOMER_LIST(),
        params: {
          page,
          limit,
          orderStatus,
        },
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
  //
  static destroyOrderItem = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: ORDER_API.DESTROY_ORDER_ITEM({ orderId }),
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
  //
  static getDetailOfOrder = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_DETAIL_OF_ORDER({ orderId }),
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

export default OrderApiService;
