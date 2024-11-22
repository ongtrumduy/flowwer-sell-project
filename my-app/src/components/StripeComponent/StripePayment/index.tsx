import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import StripePaymentApiService from '@services/api/stripe_payment';
import {
  InterfaceConfigPaymentMetaData,
  InterfaceCreatePaymentMetaData,
  InterfaceOrderInformationToPayMetaData,
  EnumOrderStatusStage,
} from '@services/api/stripe_payment/type';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import OrderApiService from '@services/api/order';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import { AppRoutes } from '@helpers/app.router';

function StripePayment() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [clientSecret, setClientSecret] = useState('');
  const { orderId } = useParams();

  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] =
    useState<InterfaceOrderInformationToPayMetaData | null>(null);

  const { userInformation } = useGetAuthInformationMetaData();

  // const orderDetails = {
  //   orderId: 'ORD987654321',
  //   customerName: 'Jane Smith',
  //   totalAmount: 200.0,
  //   items: [
  //     { id: 1, name: 'Smartphone', price: 150.0, quantity: 1 },
  //     { id: 2, name: 'Wireless Charger', price: 50.0, quantity: 1 },
  //   ],
  // };

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
    if (orderDetails?.order.total_amount) {
      StripePaymentApiService.createPaymentIntent({
        totalAmount: orderDetails?.order.total_amount,
      }).then(async (responseData) => {
        const returnDataResponse =
          responseData as InterfaceCreatePaymentMetaData;

        setClientSecret(returnDataResponse.clientSecret);
      });
    }
  }, [orderDetails?.order.total_amount]);

  useEffect(() => {
    OrderApiService.getOrderInformationToPayment({ orderId: orderId || '' })
      .then((data) => {
        console.log('response data from =================', { data });
        const returnDataResponse =
          data as InterfaceOrderInformationToPayMetaData;

        setOrderDetails(returnDataResponse);
      })
      .catch(() => {
        navigate(AppRoutes.PAGE_UNAUTHORIZED());
      });
  }, [orderId]);

  if (
    (orderDetails?.order.customerId &&
      orderDetails?.order.customerId !== userInformation.userId) ||
    !orderId
  ) {
    return <Navigate to={`${AppRoutes.PAGE_UNAUTHORIZED()}`} />;
  }

  if (
    orderDetails?.order.order_status_stage &&
    Object.values(EnumOrderStatusStage).includes(
      orderDetails?.order.order_status_stage
    ) &&
    orderDetails?.order.order_status_stage !== EnumOrderStatusStage.PENDING
  ) {
    return (
      <>
        <p>Đơn hàng của bạn đã được thanh toán rồi</p>
        <Link to={AppRoutes.ORDER_DETAIL({ orderId: orderId })}>
          Xem chi tiết đơn hàng
        </Link>
      </>
    );
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ maxWidth: '1200px !important', marginTop: 4 }}
      >
        {/* <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Avatar
            alt="Company Logo"
            src="/path/to/logo.png"
            sx={{ width: 100, height: 100, margin: '0 auto' }}
          />
        </Box> */}

        <Typography variant="h4" gutterBottom>
          Thanh Toán Đơn Hàng
        </Typography>

        <CardContent sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">Thông Tin Đơn Hàng</Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body1">
              <strong>Mã Đơn Hàng:</strong> {orderDetails?.order.order_code}
            </Typography>
            <Typography variant="body1">
              <strong>Khách Hàng:</strong> {userInformation.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {userInformation.email}
            </Typography>
            <Typography variant="body1">
              <strong>Địa chỉ:</strong> {userInformation.address}
            </Typography>
            <Typography variant="body1">
              <strong>Tổng Tiền:</strong> {orderDetails?.order.total_amount} VNĐ
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6">Sản Phẩm</Typography>
            <Grid container spacing={2}>
              {orderDetails &&
                orderDetails.order.order_item_list.length &&
                orderDetails.order.order_item_list.map((item) => (
                  <Grid item xs={12} sm={6} key={item.productId._id}>
                    <Card>
                      <Grid container alignItems="center">
                        {/* Hình ảnh sản phẩm */}
                        <Grid item xs={4}>
                          <CardMedia
                            component="img"
                            height="100" // Chiều cao hình ảnh
                            width="100" // Chiều cao hình ảnh
                            image={item.productId.product_image}
                            alt={item.productId.product_name}
                            style={{ objectFit: 'cover' }} // Tùy chỉnh hiển thị hình ảnh
                          />
                        </Grid>

                        {/* Nội dung sản phẩm */}
                        <Grid item xs={8}>
                          <CardContent>
                            <Typography variant="body1">
                              <strong>{item.productId.product_name}</strong>
                            </Typography>
                            <Typography variant="body2">
                              Giá: {item.product_price_now} VNĐ | Số lượng:{' '}
                              {item.product_quantity}
                            </Typography>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </CardContent>
        </CardContent>

        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
          </Elements>
        )}
      </Container>
    </>
  );
}

export default StripePayment;
