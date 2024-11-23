import { AppRoutes } from '@helpers/app.router';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import {
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import OrderApiService from '@services/api/order';
import { InterfaceOrderDetailMetadata_ForShipper } from '@services/api/order/type';
import { EnumOrderStatusStage } from '@services/api/stripe_payment/type';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import TimelineCustom from './TimelineCustom';

import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt

// Sample order status timeline

// Đặt ngôn ngữ mặc định là tiếng Việt
dayjs.locale('vi');

const ShipperOrderDetail = () => {
  const [orderDetail, setOrderDetail] =
    useState<InterfaceOrderDetailMetadata_ForShipper | null>(null);

  const { orderId } = useParams();

  const navigate = useNavigate();
  const { userInformation } = useGetAuthInformationMetaData();

  const [openAcceptOrderPopup, setOpenAcceptOrderPopup] = useState(false);
  const [orderAcceptId, setOrderAcceptId] = useState('');
  const [currentOrderStatus, setCurrentOrderStatus] =
    useState<EnumOrderStatusStage | null>(null);

  const handleAcceptOrder = ({
    orderId,
    currentOrderStatus,
  }: {
    orderId: string | undefined;
    currentOrderStatus: EnumOrderStatusStage | null;
  }) => {
    OrderApiService.changeStatusOfOrderOfShipper({
      orderId: orderId || '',
      currentOrderStatus,
    })
      .then((data) => {
        console.log('43 data destroyOrderItem ===>', data);

        setOrderAcceptId('');
        setOpenAcceptOrderPopup(false);

        navigate(`${AppRoutes.SHIPPER_BASE()}${AppRoutes.SHIPPER_ORDER()}`);
      })
      .catch((error) => {
        console.log('46 error =================>', error);
      });
  };

  const handleAccept = () => {
    handleAcceptOrder({
      orderId: orderAcceptId,
      currentOrderStatus: currentOrderStatus,
    });
  };

  const handleCancel = () => {
    setOpenAcceptOrderPopup(false);
    setOrderAcceptId('');
    setCurrentOrderStatus(null);
  };

  const handleOpenPopupAcceptOrder = ({
    orderId,
    currentOrderStatus,
  }: {
    orderId: string | undefined;
    currentOrderStatus: EnumOrderStatusStage | null;
  }) => {
    if (orderId) {
      setOpenAcceptOrderPopup(true);
      setOrderAcceptId(orderId);
      setCurrentOrderStatus(currentOrderStatus);
    }
  };

  const getStatusChipColor = ({
    status,
  }: {
    status: EnumOrderStatusStage | undefined;
  }) => {
    switch (status) {
      case EnumOrderStatusStage.PENDING:
        return { color: 'default', label: 'Chờ thanh toán' };
      case EnumOrderStatusStage.PAYMENT_SUCCESS:
        return { color: 'success', label: 'Thanh toán thành công' };
      case EnumOrderStatusStage.WAITING_CONFIRM:
        return { color: 'primary', label: 'Chờ cửa hàng xác nhận' };
      case EnumOrderStatusStage.PICKED_UP:
        return { color: 'warning', label: 'Đã nhận đơn hàng' };
      case EnumOrderStatusStage.IN_TRANSIT:
        return { color: 'secondary', label: 'Đang vận chuyển' };
      case EnumOrderStatusStage.DELIVERED:
        return { color: 'info', label: 'Đã giao' };
      case EnumOrderStatusStage.CANCELLED:
        return { color: 'error', label: 'Đang vận chuyển' };
      default:
        return { color: 'default', label: 'Chờ thanh toán' };
    }
  };

  useEffect(() => {
    OrderApiService.getDetailOfOrder_ForShipper({ orderId: orderId || '' })
      .then((data) => {
        console.log('response data from =================', { data });
        const returnDataResponse =
          data as InterfaceOrderDetailMetadata_ForShipper;

        setOrderDetail(returnDataResponse);
      })
      .catch(() => {
        navigate(`${AppRoutes.SHIPPER_BASE()}${AppRoutes.UNAUTHORIZED()}`);
      });
  }, [orderId]);

  if (!orderDetail?.order.customerId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
        <p style={{ fontSize: '20px' }}>
          Khách hàng này đã không còn tồn tại trên hệ thống !!!
        </p>
        <div>
          <Link to={`${AppRoutes.SHIPPER_BASE()}${AppRoutes.SHIPPER_ORDER()}`}>
            <p style={{ textDecoration: 'underline' }}>
              Quay lập trang quản lý đơn hàng
            </p>
          </Link>
        </div>
      </div>
    );
  }

  if (
    (orderDetail?.order.shipperId._id &&
      orderDetail?.order.shipperId._id !== userInformation.userId) ||
    !orderId
  ) {
    return (
      <Navigate to={`${AppRoutes.SHIPPER_BASE()}${AppRoutes.UNAUTHORIZED()}`} />
    );
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ maxWidth: '1200px !important', marginTop: 4 }}
      >
        {/* Order Timeline */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Chi tiết Đơn hàng
          </Typography>

          <TimelineCustom
            processTimeline={orderDetail?.order.process_timeline}
          />
        </Paper>

        {/* Order Header */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            <strong>Đơn hàng </strong>
            {orderDetail?.order.order_code}
          </Typography>
          <Typography color="textSecondary">
            <strong>Trạng thái:</strong>{' '}
            <Chip
              label={
                getStatusChipColor({
                  status: orderDetail?.order.order_status_stage,
                }).label
              }
              color={
                getStatusChipColor({
                  status: orderDetail?.order.order_status_stage,
                }).color as
                  | 'default'
                  | 'success'
                  | 'primary'
                  | 'warning'
                  | 'secondary'
                  | 'info'
                  | 'error'
              }
              sx={{ marginTop: '10px', marginBottom: '10px' }}
            />
          </Typography>
          <Typography color="textSecondary">
            <strong>Ngày đặt:</strong>{' '}
            {dayjs(orderDetail?.order.order_date).format(
              'HH:mm:ss [ngày] DD/MM/YYYY'
            )}
          </Typography>
        </Paper>

        {/* Customer Information */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Thông tin người nhận</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>
            <strong>Tên:</strong> {orderDetail?.order?.customerId.name}
          </Typography>
          <Typography>
            <strong>Tên:</strong> {orderDetail?.order?.customerId.email}
          </Typography>
          <Typography>
            <strong>Địa chỉ:</strong> {orderDetail?.order?.customerId.address}
          </Typography>
          <Typography>
            <strong>Số điện thoại:</strong>{' '}
            {orderDetail?.order?.customerId.phone_number}
          </Typography>
        </Paper>

        {/* Shipper Information */}
        {orderDetail?.order.order_status_stage !==
          EnumOrderStatusStage.PENDING &&
        orderDetail?.order.order_status_stage !==
          EnumOrderStatusStage.PAYMENT_SUCCESS &&
        orderDetail?.order.order_status_stage !==
          EnumOrderStatusStage.CANCELLED ? (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Thông tin người giao</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              <strong>Tên:</strong> {userInformation?.name}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong>
              {userInformation?.name}
            </Typography>
          </Paper>
        ) : (
          <></>
        )}

        {/* Order Items */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Divider sx={{ my: 1 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ảnh</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Giá
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Số lượng
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Tổng cộng
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetail?.order.order_item_list.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.productId.product_name}</TableCell>
                    <TableCell>
                      <img
                        src={item.productId.product_image}
                        alt={item.productId.product_name}
                        style={{ width: '56px', height: '56px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {item.product_price_now.toLocaleString()} VND
                    </TableCell>
                    <TableCell align="right">{item.product_quantity}</TableCell>
                    <TableCell align="right">
                      {(
                        Number(item.product_price_now) *
                        Number(item.product_quantity)
                      ).toLocaleString()}{' '}
                      VND
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
              <Typography>
                {orderDetail?.order.total_amount.toLocaleString()} VND
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <>
          {orderDetail?.order.order_status_stage ===
            EnumOrderStatusStage.WAITING_CONFIRM ||
            (orderDetail?.order.order_status_stage ===
              EnumOrderStatusStage.PAYMENT_SUCCESS && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ marginRight: '10px' }}
                onClick={() =>
                  handleOpenPopupAcceptOrder({
                    orderId: orderId,
                    currentOrderStatus: orderDetail?.order?.order_status_stage,
                  })
                }
              >
                Nhận giao đơn hàng
              </Button>
            ))}
          {(orderDetail?.order.order_status_stage ===
            EnumOrderStatusStage.PICKED_UP ||
            orderDetail?.order.order_status_stage ===
              EnumOrderStatusStage.IN_TRANSIT) && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() =>
                handleAcceptOrder({
                  orderId: orderId,
                  currentOrderStatus: orderDetail?.order?.order_status_stage,
                })
              }
            >
              Cập nhật trạng thái đơn hàng
            </Button>
          )}
        </>
      </Container>
      {/* // ================================================================= */}
      {/* Popup */}
      <Dialog
        open={openAcceptOrderPopup}
        onClose={handleCancel}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Xác nhận đơn</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Bạn có chắc chắn muốn nhận giao đơn hàng này không? Hành động này
            không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Không nhận
          </Button>
          <Button onClick={handleAccept} color="error" variant="contained">
            Nhận đơn
          </Button>
        </DialogActions>
      </Dialog>
      {/* // ================================================================= */}
    </>
  );
};

export default ShipperOrderDetail;
