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

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default OrderApiService;
