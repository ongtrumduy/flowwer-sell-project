import AxiosConfigService from '@services/axios';
import { ORDER_API } from '@services/constant';
import { AxiosHeaders } from 'axios';
import { cloneDeepWith, isObject, omitBy } from 'lodash';
import { InterfaceOrderDetailItem_ForAdmin } from './type';
import { EnumOrderStatusStage } from '../stripe_payment/type';

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
    orderStatus: EnumOrderStatusStage | 'ALL';
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

  // =========================================FOR_ADMIN========================================================
  // ===========================================================================================================
  // get all order list
  static getAllOrderList_ForAdmin = ({
    searchName,
    orderStatus,
    page,
    limit,
  }: {
    searchName: string;
    page: number;
    limit: number;
    orderStatus: EnumOrderStatusStage | 'ALL';
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
        page,
        limit,
        orderStatus,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(
            value,
            (v) => v === null || v === '' || v === undefined
          );
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.ALL_FOR_ADMIN(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllOrderList ===>', data);
          const orderListData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(orderListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get order item detail
  static getOrderItemDetail_ForAdmin = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.ORDER_DETAIL_FOR_ADMIN({
          orderId,
        }),
      })
        .then((data) => {
          // console.log('43 data getOrderItemDetail ===>', data);
          const orderDetailData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(orderDetailData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create new order
  static createNewOrder_ForAdmin = ({ formData }: { formData: FormData }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ORDER_API.CREATE_FOR_ADMIN(),
        data: formData,
        customHeaders: headers,
      })
        .then((data) => {
          console.log('98 data createNewOrder ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update order
  static updateOrder_ForAdmin = ({
    formData,
    orderId,
  }: {
    formData: FormData;
    orderId: string;
  }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.putData({
        url: ORDER_API.UPDATE_FOR_ADMIN({ orderId }),
        data: formData,
        customHeaders: headers,

        // params: {
        //   orderId,
        // },
      })
        .then((data) => {
          console.log('138 data updateOrder ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // delete order
  static deleteOrder_ForAdmin = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: ORDER_API.DELETE_FOR_ADMIN(),
        params: {
          orderId,
        },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get shipper data list
  static getShipperDataList_ForAdmin = ({
    limit,
    page,
    searchName,
  }: {
    limit: number;
    page: number;
    searchName: string;
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
        page,
        limit,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(
            value,
            (v) => v === null || v === '' || v === undefined
          );
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_SHIPPER_LIST_FOR_ADMIN(),
        params,
      })
        .then((data) => {
          const shipperData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(shipperData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get shipper data list
  static getAllOrderList_ForEmployee = ({
    limit,
    page,
    searchName,
    orderStatus,
  }: {
    limit: number;
    page: number;
    searchName: string;
    orderStatus: EnumOrderStatusStage | 'ALL';
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
        page,
        limit,
        orderStatus,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(
            value,
            (v) => v === null || v === '' || v === undefined
          );
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.ALL_FOR_EMPLOYEE(),
        params,
      })
        .then((data) => {
          const shipperData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(shipperData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get shipper data list
  static getShipperDataList_ForEmployee = ({
    limit,
    page,
    searchName,
  }: {
    limit: number;
    page: number;
    searchName: string;
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
        page,
        limit,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(
            value,
            (v) => v === null || v === '' || v === undefined
          );
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_SHIPPER_LIST_FOR_EMPLOYEE(),
        params,
      })
        .then((data) => {
          const shipperData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(shipperData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get shipper data list
  static assignShipperToDeliver_ForEmployee = ({
    shipperId,
    orderId,
  }: {
    shipperId: string;
    orderId: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ORDER_API.ASSIGN_SHIPPER_TO_DELIVER(),
        data: {
          shipperId,
          orderId,
        },
      })
        .then((data) => {
          const shipperData = data as InterfaceOrderDetailItem_ForAdmin;

          resolve(shipperData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // ===========================================================================
  //
  static getAllOrderOfShipperList = ({
    page,
    limit,
    orderStatus,
  }: {
    page: number;
    limit: number;
    orderStatus: EnumOrderStatusStage | 'ALL';
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_ALL_ORDER_OF_SHIPPER_LIST_FOR_SHIPPER(),
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
  static getDetailOfOrder_ForShipper = ({ orderId }: { orderId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ORDER_API.GET_DETAIL_OF_ORDER_FOR_SHIPPER({ orderId }),
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
  // get shipper data list
  static changeStatusOfOrderOfShipper = ({
    orderId,
    currentOrderStatus,
  }: {
    orderId: string;
    currentOrderStatus: EnumOrderStatusStage | null;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ORDER_API.CHANGE_STATUS_OF_ORDER_OF_SHIPPER_FOR_SHIPPER(),
        data: {
          orderId,
          currentOrderStatus,
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
}

export default OrderApiService;
