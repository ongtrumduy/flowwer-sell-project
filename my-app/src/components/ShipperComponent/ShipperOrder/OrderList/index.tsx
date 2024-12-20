import { AppRoutes } from '@helpers/app.router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItem,
  ListItemText,
  List as MUIList,
  Typography,
} from '@mui/material';
import OrderApiService from '@services/api/order';
import {
  InterfaceOrderListData,
  InterfaceOrderListMetadata,
} from '@services/api/order/type';
import { EnumOrderStatusStage } from '@services/api/stripe_payment/type';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

const DEFAULT_LIMIT = 5;

const OrderList = ({
  orderStatus,
}: {
  orderStatus: EnumOrderStatusStage | 'ALL';
}) => {
  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState<InterfaceOrderListData[]>([]); // Danh sách đơn hàng
  const [page, setPage] = useState(1); // Trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu không
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  const [openAcceptOrderPopup, setOpenAcceptOrderPopup] = useState(false);
  const [orderAcceptId, setOrderAcceptId] = useState('');
  const [currentOrderStatus, setCurrentOrderStatus] =
    useState<EnumOrderStatusStage | null>(null);

  const handleShowOrderDetail = ({
    orderId,
  }: {
    orderId: string | undefined;
  }) => {
    const navigateLink = `${AppRoutes.SHIPPER_BASE()}${AppRoutes.ORDER_DETAIL({ orderId })}`;

    console.log('test ============>', { navigateLink });
    navigate(navigateLink);
  };

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

        navigate(0);
      })
      .catch((error) => {
        console.log('46 error =================>', error);
      });
  };

  // Gọi API lấy danh sách đơn hàng
  const getOrderList = async ({ page }: { page: number }) => {
    setLoading(true);

    OrderApiService.getAllOrderOfShipperList({
      page,
      limit: DEFAULT_LIMIT,
      orderStatus: orderStatus,
    })
      .then((data) => {
        const newOrders = data as InterfaceOrderListMetadata;

        setOrdersList((ordersList) => [...ordersList, ...newOrders.orders]); // Thêm dữ liệu mới vào danh sách

        if (
          ordersList.length + newOrders.orders.length >=
          newOrders.totalOrderStatusItem
        ) {
          setHasMore(false); // Hết dữ liệu
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log('30 error =================>', error);
      });
  };

  // Hàm gọi khi cuộn xuống
  const loadMoreOrders = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1); // Tăng số trang
    }
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
    getOrderList({ page });
  }, [page]);

  return (
    <>
      <Box sx={{ padding: '20px' }}>
        {/* InfiniteScroll Wrapper */}
        <InfiniteScroll
          dataLength={ordersList.length} // Số lượng đơn hàng hiện tại
          next={loadMoreOrders} // Hàm tải thêm
          hasMore={hasMore} // Kiểm tra còn dữ liệu không
          loader={
            <Typography align="center" color="text.secondary">
              Đang tải...
            </Typography>
          }
          endMessage={
            <Typography align="center" color="text.secondary">
              Đã tải hết tất cả đơn hàng
            </Typography>
          }
        >
          {ordersList.map((order) => (
            <Card
              key={order._id}
              sx={{ padding: '15px', marginBottom: '10px' }}
            >
              <CardContent>
                <Typography variant="h6">
                  Mã đơn hàng: {order.order_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ngày đặt: {order.order_date}
                </Typography>
                <Chip
                  label={
                    getStatusChipColor({
                      status: order.order_status_stage,
                    }).label
                  }
                  color={
                    getStatusChipColor({
                      status: order.order_status_stage,
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
                <MUIList>
                  <>
                    {order.order_item_list.map((product, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <Box display="flex" alignItems="center" width="100%">
                            <Box
                              component="img"
                              src={product.productId.product_image}
                              alt={product.productId.product_name}
                              sx={{
                                width: 56, // Kích thước ảnh vuông
                                height: 56, // Kích thước ảnh vuông
                                marginRight: 2, // Khoảng cách giữa ảnh và văn bản
                                objectFit: 'cover', // Đảm bảo ảnh không bị méo
                              }}
                            />
                            <Box>
                              <ListItemText
                                primary={`${product.productId.product_name} x${product.product_quantity}`}
                                secondary={`${product.product_price_now.toLocaleString()} VNĐ`}
                              />
                            </Box>
                          </Box>
                        </ListItem>
                        {index < order.order_item_list.length - 1 && (
                          <Divider />
                        )}
                      </React.Fragment>
                    ))}
                  </>
                </MUIList>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', marginTop: '10px' }}
                ></Typography>
                <Box sx={{ marginTop: '10px' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ marginRight: '10px' }}
                    onClick={() =>
                      handleShowOrderDetail({ orderId: order?._id })
                    }
                  >
                    Xem chi tiết
                  </Button>
                  {order.order_status_stage ===
                    EnumOrderStatusStage.WAITING_CONFIRM ||
                    (order.order_status_stage ===
                      EnumOrderStatusStage.PAYMENT_SUCCESS && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ marginRight: '10px' }}
                        onClick={() =>
                          handleOpenPopupAcceptOrder({
                            orderId: order?._id,
                            currentOrderStatus: order?.order_status_stage,
                          })
                        }
                      >
                        Nhận giao đơn hàng
                      </Button>
                    ))}
                  {(order.order_status_stage ===
                    EnumOrderStatusStage.PICKED_UP ||
                    order.order_status_stage ===
                      EnumOrderStatusStage.IN_TRANSIT) && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() =>
                        handleAcceptOrder({
                          orderId: order?._id,
                          currentOrderStatus: order?.order_status_stage,
                        })
                      }
                    >
                      Cập nhật trạng thái đơn hàng
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </InfiniteScroll>
      </Box>
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

export default OrderList;
