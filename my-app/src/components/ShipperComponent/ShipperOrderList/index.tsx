import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { SetStateAction, useState } from 'react';

const ShipperOrderList = () => {
  // Dữ liệu đơn hàng giả lập
  const [orders, setOrders] = useState({
    pending: [
      {
        id: 1,
        customerName: 'Nguyễn Văn A',
        address: '123 Đường ABC',
        phone: '0901234567',
        status: 'Chờ giao',
        estimatedTime: '2h 30m',
      },
      {
        id: 2,
        customerName: 'Trần Thị B',
        address: '456 Đường XYZ',
        phone: '0912345678',
        status: 'Chờ giao',
        estimatedTime: '3h 15m',
      },
    ],
    inProgress: [
      {
        id: 3,
        customerName: 'Lê Minh C',
        address: '789 Đường LMN',
        phone: '0923456789',
        status: 'Đang giao',
        estimatedTime: '1h 20m',
      },
    ],
    completed: [
      {
        id: 4,
        customerName: 'Phan Duy K',
        address: '101 Đường DEF',
        phone: '0934567890',
        status: 'Đã giao',
        estimatedTime: '1h 45m',
      },
    ],
  });

  const [tabIndex, setTabIndex] = useState(0); // Chỉ số tab đang được chọn
  const [loading, setLoading] = useState(false);

  const handleTabChange = (
    event: unknown,
    newValue: SetStateAction<number>
  ) => {
    setTabIndex(newValue);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    setLoading(true);
    // Giả lập cập nhật trạng thái đơn hàng
    setTimeout(() => {
      // Chuyển đổi trạng thái đơn hàng
      const newOrders = { ...orders };
      for (const key in newOrders) {
        if (key === 'pending' || key === 'inProgress' || key === 'completed') {
          newOrders[key] = newOrders[key].map((order) =>
            order.id === id ? { ...order, status } : order
          );
        }
      }
      setOrders(newOrders);
      setLoading(false);
    }, 1500);
  };

  // Lọc đơn hàng theo tab
  const getOrdersForTab = () => {
    switch (tabIndex) {
      case 0:
        return orders['pending'];
      case 1:
        return orders['inProgress'];
      case 2:
        return orders['completed'];
      default:
        return [];
    }
  };

  return (
    // <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Quản lý Đơn hàng
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Quản lý đơn hàng"
      >
        <Tab label="Đơn hàng chờ giao" />
        <Tab label="Đơn hàng đang giao" />
        <Tab label="Đơn hàng đã giao" />
      </Tabs>

      {/* Bảng đơn hàng */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Khách hàng</strong>
              </TableCell>
              <TableCell>
                <strong>Địa chỉ</strong>
              </TableCell>
              <TableCell>
                <strong>SĐT</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell>
                <strong>Thời gian dự kiến</strong>
              </TableCell>
              <TableCell>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getOrdersForTab().map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        order.status === 'Đang giao'
                          ? 'green'
                          : order.status === 'Chờ giao'
                            ? 'orange'
                            : 'gray',
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell>{order.estimatedTime}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateStatus(order.id, 'Đang giao')}
                    disabled={loading || order.status === 'Đã giao'}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Cập nhật trạng thái'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* </Container> */}
    </Box>
  );
};

export default ShipperOrderList;
