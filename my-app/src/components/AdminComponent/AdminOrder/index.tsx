import {
  Box,
  Card,
  CardContent,
  Chip,
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
import {
  InterfaceNeoOrder,
  InterfaceNeoOrderResponseMetadata,
} from '@services/api/order/type';
import { EnumOrderStatusStage } from '@services/api/stripe_payment/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import AdminPaginationOrderList from './AdminPaginationOrderList';
import AdminSearchOrderForm from './AdminSearchOrderForm';
import dayjs from 'dayjs';

import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt

// Sample order status timeline

// Đặt ngôn ngữ mặc định là tiếng Việt
dayjs.locale('vi');

const AdminOrder: React.FC = () => {
  // =============================================================================
  // =============================================================================
  const [orderList, setOrderList] = useState<InterfaceNeoOrder[]>([]);
  const [searchParams, setSearchParams] = useState<{
    searchName: string;
    orderStatus: EnumOrderStatusStage | 'ALL';
    page: number;
    limit: number;
    isPendingCall: boolean;
  }>({
    searchName: '',
    orderStatus: 'ALL',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  // const [roleList, setRoleList] = useState<{ roleName: string; roleId: string }[]>([]);
  // const [orderDetail] = useState<InterfaceNeoOrder>({
  //   orderId: '',
  //   order_item_list: [],
  //   total_amount: 0,
  //   customerId: '',
  //   pickup_address: '',
  //   delivery_address: '',
  //   order_status_stage: EnumOrderStatusStage.PENDING,
  //   process_timeline: [],
  //   order_date: '',
  //   delivery_date: '',
  //   pickup_date: '',
  //   shipperId: '',
  //   order_code: '',
  //   customerDetails: null,
  //   shipperDetails: null,
  // });

  // const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  // const [openEditPopup, setOpenEditPopup] = useState(false);
  // const [openDeletePopup, setOpenDeletePopup] = useState(false);

  // const [deleteOrderId, setDeleteOrderId] = useState('');

  //============================================================================
  //============================================================================

  const handleSearchOrder = ({
    searchName,
    orderStatus,
  }: {
    searchName: string;
    orderStatus: EnumOrderStatusStage | 'ALL';
  }) => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        searchName,
        orderStatus,
        isPendingCall: true,
      };
    });
  };

  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  // const handleOpenAddNewPopup = () => {
  //   setOpenAddNewPopup(true);
  // };

  // const handleOpenEditPopup = ({ orderId }: { orderId: string | undefined }) => {
  //   if (orderId) {
  //     OrderApiService.getOrderItemDetail_ForAdmin({ orderId })
  //       .then((data) => {
  //         const orderDetail = data as InterfaceOrderDetailItemMetaData;
  //         console.log('Order Detail ===>', orderDetail);

  //         // setOrderDetail(orderDetail.OrderDetail);
  //       })
  //       .then(() => {
  //         setOpenEditPopup(true);
  //       });
  //   }
  // };

  // const handleOpenDeletePopup = ({ orderId }: { orderId: string | undefined }) => {
  //   if (orderId) {
  //     setOpenDeletePopup(true);
  //     setDeleteOrderId(orderId);
  //   }
  // };

  // const handleCloseAddNewPopup = () => {
  //   setOpenAddNewPopup(false);
  // };

  // const handleCloseEditPopup = () => {
  //   setOpenEditPopup(false);
  // };

  // const handleCloseDeletePopup = () => {
  //   setOpenDeletePopup(false);
  // };

  // =============================================================================
  // =============================================================================

  const handleGetOrderList = () => {
    OrderApiService.getAllOrderList_ForAdmin(searchParams)
      .then((data) => {
        const orderList = data as InterfaceNeoOrderResponseMetadata;

        setOrderList(orderList.orders);
        setTotalSearchCount(orderList.totalSearchCount);
      })
      .catch(() => {})
      .finally(() => {
        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      });
  };

  // =============================================================================
  // =============================================================================
  useEffect(() => {
    handleGetOrderList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  // useEffect(() => {
  //   setRoleList(() => {
  //     return [...Object.values(EnumRole).map((role) => ({ roleId: role, roleName: role }))];
  //   });
  // }, []);

  //============================================================================
  //============================================================================
  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Đơn hàng
        </Typography>

        <AdminSearchOrderForm onSearch={handleSearchOrder} />

        <Card>
          <CardContent>
            {/* <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddNewPopup}>
              Thêm mới Đơn hàng
            </Button> */}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Mã đơn hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm </TableCell>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Ảnh đại diện</TableCell> */}
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Tổng giá trị</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Tên người nhận
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Địa chỉ nhận hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Ngày đặt hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Trạng thái đơn hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Người giao
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList.map((order) => (
                    <TableRow key={order.orderId}>
                      {/* <TableCell>{order.orderId}</TableCell> */}
                      <TableCell>{order.order_code}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'column',
                          }}
                        >
                          {order.order_item_list &&
                          order.order_item_list.length ? (
                            order.order_item_list.map((value) => {
                              const product = value.product_name;
                              const amount = value.product_quantity;
                              const price = value.product_price_now;

                              return (
                                <div
                                  style={{
                                    background: 'grba(0,0,0,0.8)',
                                    padding: '5px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <span>{product}</span>
                                  <span>
                                    {amount} x{' '}
                                    <NumericFormat
                                      value={Number(price || 0)}
                                      thousandSeparator={'.'}
                                      decimalSeparator={','}
                                      displayType={'text'}
                                      suffix={' VNĐ'}
                                      className="money"
                                    />
                                  </span>
                                </div>
                              );
                            })
                          ) : (
                            <p>Không có sản phẩm nào</p>
                          )}
                          <span>
                            --------------------------------------------
                          </span>
                          <span>
                            Tổng giá trị:{' '}
                            <NumericFormat
                              value={Number(order.total_amount || 0)}
                              thousandSeparator={'.'}
                              decimalSeparator={','}
                              displayType={'text'}
                              suffix={' VNĐ'}
                              className="money"
                            />
                          </span>
                        </Box>
                      </TableCell>
                      {/* <TableCell>{order.total_amount}</TableCell> */}
                      <TableCell>
                        {order.customerDetails?.name || 'Ẩn danh'}
                      </TableCell>
                      <TableCell>{order.delivery_address}</TableCell>
                      <TableCell>
                        {dayjs(order.order_date).format(
                          'HH:mm:ss [ngày] DD/MM/YYYY'
                        )}
                      </TableCell>
                      {/* <TableCell>{order.order_status_stage}</TableCell> */}
                      <TableCell>
                        <Box>
                          <Chip
                            key={order.order_status_stage}
                            label={order.order_status_stage}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {order.shipperDetails?.name ||
                          (order.order_status_stage ===
                            EnumOrderStatusStage.PENDING ||
                          order.order_status_stage ===
                            EnumOrderStatusStage.WAITING_CONFIRM ||
                          order.order_status_stage ===
                            EnumOrderStatusStage.PAYMENT_SUCCESS ||
                          order.order_status_stage ===
                            EnumOrderStatusStage.CANCELLED
                            ? 'Chưa giao'
                            : 'Ẩn danh')}
                      </TableCell>

                      {/* <TableCell> */}
                      {/* <Button variant="outlined" color="primary" onClick={() => handleOpenEditPopup({ orderId: order?.orderId })} sx={{ mr: 1 }}>
                          Sửa
                        </Button> */}
                      {/* <Button variant="outlined" color="secondary" onClick={() => handleOpenDeletePopup({ orderId: order?.orderId })}>
                          Xóa
                        </Button> */}
                      {/* {order.order_status_stage === EnumOrderStatusStage.PENDING && (
                          <Button variant="outlined" color="primary">
                            Chỉ định giao hàng
                          </Button>
                        )} */}
                      {/* </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <AdminPaginationOrderList
                totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)}
                onPageChange={handlePageChange}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* // ============================================================================= */}
      {/* <ModalAddNewOrder
        openAddNewPopup={openAddNewPopup}
        handleDialogClose={handleCloseAddNewPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleAddOrder={handleAddOrder}
        // control={control}
        // errors={errors}
        setOpenAddNewPopup={setOpenAddNewPopup}
        // handleGetOrderList={handleGetOrderList}
      /> */}
      {/* // ============================================================================= */}
      {/* <ModalEditOrder
        openEditPopup={openEditPopup}
        handleCloseEditPopup={handleCloseEditPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleEditOrder={handleEditOrder}
        // control={control}
        orderDetail={orderDetail}
        // reset={reset}
        setOpenEditPopup={setOpenEditPopup}
      /> */}
      {/* // ============================================================================= */}
      {/* <ModalDeleteOrder
        openDeletePopup={openDeletePopup}
        handleCloseDeletePopup={handleCloseDeletePopup}
        // handleDeleteOrder={handleDeleteOrder}
        deleteOrderId={deleteOrderId}
        setOpenDeletePopup={setOpenDeletePopup}
      /> */}
      {/* // ============================================================================= */}
    </>
  );
};

export default AdminOrder;
