import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

interface Order {
  orderId: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
}

const orders: Order[] = [
  {
    orderId: '123',
    customerName: 'Alice',
    orderDate: '2024-11-01',
    status: 'Delivered',
    totalAmount: 120.5,
  },
  {
    orderId: '124',
    customerName: 'Bob',
    orderDate: '2024-11-02',
    status: 'Pending',
    totalAmount: 80.0,
  },
  {
    orderId: '125',
    customerName: 'Charlie',
    orderDate: '2024-11-03',
    status: 'Shipped',
    totalAmount: 150.75,
  },
  // Thêm dữ liệu mẫu tại đây
];

const AdminOrder: React.FC = () => {
  const handleEdit = (orderId: string) => {
    console.log(`Editing order: ${orderId}`);
  };

  const handleDelete = (orderId: string) => {
    console.log(`Deleting order: ${orderId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(order.orderId)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(order.orderId)}
                        color="secondary"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminOrder;
