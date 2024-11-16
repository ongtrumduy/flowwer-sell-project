import { useEffect, useState } from 'react';

import StripePaymentApiService from '@services/api/stripe_payment';
import {
  InterfaceConfigPaymentMetaData,
  InterfaceCreatePaymentMetaData,
} from '@services/api/stripe_payment/type';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

function StripePayment() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [clientSecret, setClientSecret] = useState('');

  const orderDetails = {
    orderId: 'ORD987654321',
    customerName: 'Jane Smith',
    totalAmount: 200.0,
    items: [
      { id: 1, name: 'Smartphone', price: 150.0, quantity: 1 },
      { id: 2, name: 'Wireless Charger', price: 50.0, quantity: 1 },
    ],
  };

  useEffect(() => {
    StripePaymentApiService.configForStripePayment().then(
      async (responseData) => {
        const returnDataResponse =
          responseData as InterfaceConfigPaymentMetaData;
        setStripePromise(loadStripe(returnDataResponse.publishableKey));
      }
    );
  }, []);

  useEffect(() => {
    StripePaymentApiService.createPaymentIntent({ totalAmount: 100000 }).then(
      async (responseData) => {
        const returnDataResponse =
          responseData as InterfaceCreatePaymentMetaData;

        setClientSecret(returnDataResponse.clientSecret);
      }
    );
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ maxWidth: '1200px !important', marginTop: 4 }}
      >
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Avatar
            alt="Company Logo"
            src="/path/to/logo.png"
            sx={{ width: 100, height: 100, margin: '0 auto' }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          Thanh Toán Đơn Hàng
        </Typography>

        <CardContent sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">Thông Tin Đơn Hàng</Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body1">
              <strong>Mã Đơn Hàng:</strong> {orderDetails.orderId}
            </Typography>
            <Typography variant="body1">
              <strong>Khách Hàng:</strong> {orderDetails.customerName}
            </Typography>
            <Typography variant="body1">
              <strong>Tổng Tiền:</strong> ${orderDetails.totalAmount}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6">Sản Phẩm</Typography>
            <Grid container spacing={2}>
              {orderDetails.items.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="body1">
                        <strong>{item.name}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Giá: ${item.price} | Số lượng: {item.quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </CardContent>

        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}
      </Container>
    </>
  );
}

export default StripePayment;
