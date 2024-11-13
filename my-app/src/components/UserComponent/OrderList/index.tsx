import CancelOrderModal from '@components/ModalComponent/CancelOrderModal';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function OrderList() {
  // Giả sử đây là danh sách đơn hàng
  const [orders, setOrders] = React.useState([
    {
      orderID: '001',
      customerName: 'Nguyễn Văn A',
      date: '2024-11-01',
      totalAmount: 500000,
      status: 'Pending',
    },
    {
      orderID: '002',
      customerName: 'Trần Thị B',
      date: '2024-11-02',
      totalAmount: 750000,
      status: 'Completed',
    },
    {
      orderID: '003',
      customerName: 'Lê Văn C',
      date: '2024-11-03',
      totalAmount: 1000000,
      status: 'Canceled',
    },
  ]);

  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // const [selectedTab, setSelectedTab] = useState(0);

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setSelectedTab(newValue);
  // };

  // Phân loại đơn hàng theo trạng thái
  const filterOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const handleChangePage = (
    _event: unknown,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = ({ orderId }: { orderId: string }) => {
    console.log('Xem chi tiết đơn hàng:', orderId);

    navigate(`/order-detail/${orderId}`);
  };

  const handleCancelOrder = ({ orderId }: { orderId: string | null }) => {
    console.log('Hủy đơn hàng:', orderId);

    handleOpenModal({ orderId });
  };

  const handleOpenModal = ({ orderId }: { orderId: string | null }) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrderId(null);
  };

  const handleConfirmCancel = () => {
    setOrders(orders.filter((order) => order.orderID !== selectedOrderId));
    handleCloseModal();
  };

  const OrderListContent = ({ ordersList }: { ordersList: typeof orders }) => {
    return (
      <Paper>
        <Table aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ordersList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.orderID}>
                  <TableCell>{order.orderID}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {order.totalAmount.toLocaleString()} VND
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleViewDetails({ orderId: order.orderID })
                      }
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        handleCancelOrder({ orderId: order.orderID })
                      }
                    >
                      Hủy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  };

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Danh sách đơn hàng
      </Typography>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Pending" value="Pending" />
              <Tab label="Shipped" value="Shipped" />
              <Tab label="Delivered" value="Delivered" />
            </TabList>
          </Box>

          {/* // ================================================================= */}
          <TabPanel value={'Pending'}>
            <OrderListContent ordersList={filterOrdersByStatus('Pending')} />
          </TabPanel>
          <TabPanel value={'Shipped'}>
            <OrderListContent ordersList={filterOrdersByStatus('Shipped')} />
          </TabPanel>
          <TabPanel value={'Delivered'}>
            <OrderListContent ordersList={filterOrdersByStatus('Delivered')} />
          </TabPanel>
          {/* // ================================================================= */}
        </TabContext>
      </Box>

      <CancelOrderModal
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
      />
    </Container>
  );
}

export default OrderList;
