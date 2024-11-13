import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const orderDetails = {
    orderId: 'ORD987654321',
    customerName: 'Jane Smith',
    totalAmount: 200.0,
    items: [
      { id: 1, name: 'Smartphone', price: 150.0, quantity: 1 },
      { id: 2, name: 'Wireless Charger', price: 50.0, quantity: 1 },
    ],
  };

  const handlePayment = () => {
    alert(
      `Payment of $${orderDetails.totalAmount} has been made successfully!`
    );
  };

  const handleBackToOrders = () => {
    alert('Returning to order list...');
  };

  return (
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

      <Card>
        <CardContent>
          <Typography variant="h6">Phương Thức Thanh Toán</Typography>
          <Divider sx={{ marginY: 2 }} />

          <FormControl component="fieldset">
            <RadioGroup
              row
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="creditCard"
                control={<Radio />}
                label="Thẻ Tín Dụng"
              />
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="PayPal"
              />
            </RadioGroup>
          </FormControl>

          {paymentMethod === 'creditCard' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số Thẻ"
                  variant="outlined"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  inputProps={{ maxLength: 16 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày Hết Hạn (MM/YY)"
                  variant="outlined"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  variant="outlined"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleBackToOrders}
          >
            Quay Lại Đơn Hàng
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handlePayment}>
            Thanh Toán
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Payment;
