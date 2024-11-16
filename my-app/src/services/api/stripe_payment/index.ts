import AxiosConfigService from '@services/axios';
import { STRIPE_PAYMENT_API } from '@services/constant';
import { InterfaceConfigPaymentData, InterfaceCreatePaymentData } from './type';

class StripePaymentApiService {
  // ===========================================================================
  // get all product list
  static configForStripePayment = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: STRIPE_PAYMENT_API.CONFIG(),
      })
        .then((data: unknown) => {
          const configPaymentData = data as InterfaceConfigPaymentData;

          resolve(configPaymentData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get product item detail
  static createPaymentIntent = ({ totalAmount }: { totalAmount: number }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: STRIPE_PAYMENT_API.CREATE_PAYMENT(),
        data: { totalAmount },
      })
        .then((data) => {
          const paymentData = data as InterfaceCreatePaymentData;

          resolve(paymentData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default StripePaymentApiService;
