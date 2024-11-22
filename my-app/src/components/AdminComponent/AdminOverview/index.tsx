import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import OverviewApiService from '@services/api/overview';
import { InterfaceOrdersByMonthMetaData, InterfaceOverviewMetaData, InterfaceRevenueByMonthMetaData, InterfaceUsersByMonthMetaData } from '@services/api/overview/type';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NumericFormat } from 'react-number-format';

const AdminDashboard: React.FC = () => {
  const [overviewData, setOverviewData] = useState<InterfaceOverviewMetaData | null>(null);

  const [dataOrdersByMonth, setDataOrdersByMonth] = useState<InterfaceOrdersByMonthMetaData | null>(null);
  const [dataRevenueByMonth, setDataRevenueByMonth] = useState<InterfaceRevenueByMonthMetaData | null>(null);
  const [dataUsersByMonth, setDataUsersByMonth] = useState<InterfaceUsersByMonthMetaData | null>(null);

  useEffect(() => {
    OverviewApiService.overviewDashboardCountInformation().then((res) => {
      const returnData = res as InterfaceOverviewMetaData;

      console.log('returnData ===>', { returnData });

      setOverviewData(returnData || null);
    });
  }, []);

  useEffect(() => {
    OverviewApiService.getOrdersByMonth().then((res) => {
      const returnData = res as InterfaceOrdersByMonthMetaData;

      console.log('returnData ===>', { returnData });
      setDataOrdersByMonth(returnData);
    });
  }, []);

  useEffect(() => {
    OverviewApiService.getRevenueByMonth().then((res) => {
      const returnData = res as InterfaceRevenueByMonthMetaData;

      console.log('returnData ===>', { returnData });

      setDataRevenueByMonth(returnData);
    });
  }, []);

  useEffect(() => {
    OverviewApiService.getUsersByMonth().then((res) => {
      const returnData = res as InterfaceUsersByMonthMetaData;

      console.log('returnData ===>', { returnData });

      setDataUsersByMonth(returnData);
    });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thống kê tổng quan
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng doanh thu</Typography>
              <Typography variant="h5">
                <NumericFormat value={Number(overviewData?.totalRevenue || 0)} thousandSeparator={'.'} decimalSeparator={','} displayType={'text'} suffix={' VNĐ'} className="money" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số người dùng</Typography>
              <Typography variant="h5">
                <NumericFormat value={Number(overviewData?.totalUsers || 0)} thousandSeparator={'.'} decimalSeparator={','} displayType={'text'} suffix={''} className="money" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số đơn hàng</Typography>
              <Typography variant="h5">
                <NumericFormat value={Number(overviewData?.totalOrders || 0)} thousandSeparator={'.'} decimalSeparator={','} displayType={'text'} suffix={''} className="money" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số sản phẩm</Typography>
              <Typography variant="h5">
                <NumericFormat value={Number(overviewData?.totalProducts || 0)} thousandSeparator={'.'} decimalSeparator={','} displayType={'text'} suffix={''} className="money" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Biểu Đồ Doanh Thu */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Doanh thu theo thời gian</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataRevenueByMonth?.revenueByMonthResult as never}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Biểu Đồ Người Dùng */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Người dùng theo thời gian</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataUsersByMonth?.usersByMonthResult as never}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalUsers" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        {/* Biểu Đồ Người Dùng */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Đơn hàng theo thời gian</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataOrdersByMonth?.ordersByMonthResult as never}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
