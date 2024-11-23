import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Container, Tab, Typography } from '@mui/material';
import { EnumOrderStatusStage } from '@services/api/stripe_payment/type';
import { useState } from 'react';
import OrderList from '../OrderList';

function OrderTab() {
  const [tabValue, setTabValue] = useState(EnumOrderStatusStage.PENDING);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: EnumOrderStatusStage
  ) => {
    setTabValue(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        Danh sách đơn hàng
      </Typography>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Chờ thanh toán'}
                  </p>
                }
                value={EnumOrderStatusStage.PENDING}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Thanh toán thành công'}
                  </p>
                }
                value={EnumOrderStatusStage.PAYMENT_SUCCESS}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Chờ cửa hàng xác nhận'}
                  </p>
                }
                value={EnumOrderStatusStage.WAITING_CONFIRM}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Đã nhận đơn hàng'}
                  </p>
                }
                value={EnumOrderStatusStage.PICKED_UP}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Đang vận chuyển'}
                  </p>
                }
                value={EnumOrderStatusStage.IN_TRANSIT}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Đã giao'}
                  </p>
                }
                value={EnumOrderStatusStage.DELIVERED}
              />
              <Tab
                label={
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {'Đã hủy'}
                  </p>
                }
                value={EnumOrderStatusStage.CANCELLED}
              />
            </TabList>
          </Box>

          {/* // ================================================================= */}
          <TabPanel value={EnumOrderStatusStage.PENDING}>
            <OrderList orderStatus={EnumOrderStatusStage.PENDING} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.PAYMENT_SUCCESS}>
            <OrderList orderStatus={EnumOrderStatusStage.PAYMENT_SUCCESS} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.WAITING_CONFIRM}>
            <OrderList orderStatus={EnumOrderStatusStage.WAITING_CONFIRM} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.PICKED_UP}>
            <OrderList orderStatus={EnumOrderStatusStage.PICKED_UP} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.IN_TRANSIT}>
            <OrderList orderStatus={EnumOrderStatusStage.IN_TRANSIT} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.DELIVERED}>
            <OrderList orderStatus={EnumOrderStatusStage.DELIVERED} />
          </TabPanel>
          <TabPanel value={EnumOrderStatusStage.CANCELLED}>
            <OrderList orderStatus={EnumOrderStatusStage.CANCELLED} />
          </TabPanel>
          {/* // ================================================================= */}
        </TabContext>
      </Box>
    </Container>
  );
}

export default OrderTab;
