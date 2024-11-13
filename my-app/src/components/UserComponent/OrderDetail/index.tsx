import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import TimelineCustom from './TimelineCustom';

// Sample order status timeline

const OrderDetailComponent = () => {
  const sampleOrder = {
    orderId: '123456',
    status: 'Delivered',
    date: '2024-11-02',
    customer: {
      name: 'John Doe',
      address: '123 Example St, Hanoi, Vietnam',
      phone: '0123456789',
    },
    items: [
      { id: 1, name: 'Product A', price: 300000, quantity: 2 },
      { id: 2, name: 'Product B', price: 150000, quantity: 1 },
    ],
    total: 750000,
  };

  const { orderId, status, date, customer, items, total } = sampleOrder;

  const handleRequestToCancelOrder = () => {};

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      {/* Order Timeline */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quá trình của Đơn hàng
        </Typography>

        <TimelineCustom />
      </Paper>

      {/* Order Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Đơn hàng #{orderId}</Typography>
        <Typography color="textSecondary">Trạng thái: {status}</Typography>
        <Typography color="textSecondary">Ngày đặt: {date}</Typography>
      </Paper>

      {/* Customer Information */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Thông tin người nhận</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography>
          <strong>Tên:</strong> {customer.name}
        </Typography>
        <Typography>
          <strong>Địa chỉ:</strong> {customer.address}
        </Typography>
        <Typography>
          <strong>Số điện thoại:</strong> {customer.phone}
        </Typography>
      </Paper>

      {/* Shipper Information */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Thông tin người giao</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography>
          <strong>Tên:</strong> {customer.name}
        </Typography>
        <Typography>
          <strong>Số điện thoại:</strong> {customer.phone}
        </Typography>
      </Paper>

      {/* Order Items */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Order Items</Typography>
        <Divider sx={{ my: 1 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Tổng cộng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    {item.price.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Summary */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Tổng đơn hàng</Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container>
          <Grid item xs={6}>
            <Typography>Thành tiền:</Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography>{total.toLocaleString()} VND</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        {/* <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Xem hóa đơn
        </Button> */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleRequestToCancelOrder}
        >
          Yêu cầu hủy đơn
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetailComponent;
