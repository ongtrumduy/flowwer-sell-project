import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const sampleProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 100, category: 'Category A', stock: 20 },
  { id: 2, name: 'Product 2', price: 200, category: 'Category B', stock: 15 },
  { id: 3, name: 'Product 3', price: 300, category: 'Category C', stock: 30 },
];

const AdminProduct: React.FC = () => {
  const handleEdit = (id: number) => {
    console.log(`Edit product with id ${id}`);
    // Xử lý logic cho nút Edit, ví dụ: Chuyển hướng hoặc hiển thị form sửa đổi
  };

  const handleDelete = (id: number) => {
    console.log(`Delete product with id ${id}`);
    // Xử lý logic cho nút Delete
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Card>
        <CardContent>
          <Button variant="contained" color="primary" sx={{ mb: 2 }}>
            Add New Product
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(product.id)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
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

export default AdminProduct;
