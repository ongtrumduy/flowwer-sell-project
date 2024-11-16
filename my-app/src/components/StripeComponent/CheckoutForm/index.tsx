import { PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Card, Container } from '@mui/material';
import { AppRoutes } from '@helpers/app.router';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import styles from './CheckoutForm.module.scss';

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [setPaymentInfo] = useState<{
  //   id: string;
  //   amount: number;
  //   currency: string;
  //   status: string;
  //   created: number;
  // } | null>(null); // Trạng thái và thông tin thanh toán

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    // 1. Gọi elements.submit() để submit thông tin payment từ các thành phần Stripe Elements
    const submitResult = await elements.submit();

    if (submitResult.error) {
      // Nếu có lỗi từ elements.submit() thì báo lỗi
      console.error('Error submitting form data:', submitResult.error.message);
      setMessage(submitResult.error.message as string);
      return;
    }

    try {
      const result = await stripe.confirmPayment({
        elements,
        // confirmParams: {
        //   // Make sure to change this to your payment completion page
        //   return_url: `${window.location.origin}/${AppRoutes.COMPLETION()}`,
        // },
        redirect: 'if_required',
        clientSecret: clientSecret,
      });

      if (result?.paymentIntent) {
        if (result?.paymentIntent.status === 'succeeded') {
          const tempPaymentInfo = {
            id: result.paymentIntent.id,
            amount: result.paymentIntent.amount,
            currency: result.paymentIntent.currency,
            status: result.paymentIntent.status,
            created: result.paymentIntent.created,
          };

          // setPaymentInfo(tempPaymentInfo);

          const queryStringParams = queryString.stringify(tempPaymentInfo);

          navigate(`${AppRoutes.COMPLETION()}?${queryStringParams}`);
        }
        setIsProcessing(false);

        return;
      }

      if (
        (result?.error && result?.error.type === 'card_error') ||
        (result?.error &&
          result?.error.type === 'validation_error' &&
          result.error?.message)
      ) {
        setMessage(result.error?.message as string);
      } else {
        setMessage(
          'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại !!!'
        );
      }
    } catch (error) {
      setMessage((error as Error)?.message as string);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginY: 4, marginTop: 0 }}
    >
      <Card sx={{ padding: 3 }}>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" />
          <Button
            disabled={isProcessing || !stripe || !elements}
            id="submit"
            variant="outlined"
            color="primary"
            sx={{ marginTop: 2 }}
            type="submit"
          >
            <span>{isProcessing ? 'Đang chờ ... ' : 'Thanh toán ngay'}</span>
          </Button>
          {/* Show any error or success messages */}
          {message && <div className={styles.message_text}>{message}</div>}
        </form>
      </Card>
    </Container>
  );
}

export default CheckoutForm;
