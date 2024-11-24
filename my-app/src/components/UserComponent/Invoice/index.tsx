import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from '@mui/material';

const invoiceData = {
  title: 'SÂN CẦU LÔNG BABO',
  address:
    'Hẻm Làng hoa Phó Thọ, qua cầu Bà Bộ, Nguyễn Văn Linh, P. Long Hòa, Q. Bình Thủy, TP. Cần Thơ',
  hotline: '0777.07.40.34',
  invoiceId: 'HD000231',
  date: '21/08/2024 18:39',
  customer: 'Khách lẻ',
  cashier: 'Sân Cầu Lông BaBo',
  court: 'Sân 02',
  items: [
    { name: 'Thuê sân (giờ)', price: 50000, quantity: 1.533, total: 76550 },
    { name: 'Cầu lẻ', price: 25000, quantity: 4, total: 100000 },
    { name: 'Revive', price: 12000, quantity: 1, total: 12000 },
  ],
  total: 188650,
};

function Invoice() {
  return (
    <div>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hóa đơn bán hàng
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Invoice Content */}
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">
              {invoiceData.title}
            </Typography>
            <Typography variant="body1" align="center">
              {invoiceData.address}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Hotline: {invoiceData.hotline}
            </Typography>

            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Mã hóa đơn: {invoiceData.invoiceId}
            </Typography>
            <Typography variant="body2">Ngày: {invoiceData.date}</Typography>
            <Typography variant="body2">
              Khách hàng: {invoiceData.customer}
            </Typography>
            <Typography variant="body2">
              Thu ngân: {invoiceData.cashier}
            </Typography>
            <Typography variant="body2">Sân: {invoiceData.court}</Typography>
          </CardContent>
        </Card>

        {/* Items Table */}
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên hàng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    {item.price.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.total.toLocaleString()} đ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total Amount */}
        <Card sx={{ marginTop: 3 }}>
          <CardContent>
            <Typography variant="h6" align="right">
              Tổng cộng: {invoiceData.total.toLocaleString()} đ
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default Invoice;
