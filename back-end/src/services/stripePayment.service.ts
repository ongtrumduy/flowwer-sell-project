import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import { EnumReasonStatusCode } from '../utils/type';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
});

class StripePaymentService {
  //=====================================================================
  // config for the Stripe payment
  static configForStripePayment = async () => {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        publishableKey,
      },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Publishable Key Successfully !!!',
    });
  };

  //=====================================================================
  // create payment intent
  static createPaymentIntent = async ({
    totalAmount,
  }: {
    totalAmount: number;
  }) => {
    try {
      if (totalAmount < 10000) {
        throw new ErrorDTODataResponse({
          statusCode: 400,
          reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
          message:
            'Total amount must be greater than or equal to 10,000 VND!!!',
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'VND',
        amount: totalAmount,
        automatic_payment_methods: { enabled: true },
      });

      // Send publishable key and PaymentIntent details to client
      const clientSecret = await paymentIntent.client_secret;

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          clientSecret,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create Payment Intent Successfully !!!',
      });
    } catch (e) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (e as Error).message || 'Create Payment Intent Failed!!!',
      });
    }
  };
}

export default StripePaymentService;
