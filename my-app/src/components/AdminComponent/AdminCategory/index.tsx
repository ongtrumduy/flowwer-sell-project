import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

// Dữ liệu mẫu
interface Category {
  id: string;
  name: string;
  description: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Gadgets and devices' },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel' },
  { id: '3', name: 'Food', description: 'Edible products' },
];

const AdminCategory: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description);
    } else {
      setCurrentCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCategory = () => {
    if (currentCategory) {
      // Cập nhật danh mục
      setCategories(
        categories.map((cat) =>
          cat.id === currentCategory.id
            ? { ...cat, name: categoryName, description: categoryDescription }
            : cat
        )
      );
    } else {
      // Thêm danh mục mới
      const newCategory: Category = {
        id: (categories.length + 1).toString(),
        name: categoryName,
        description: categoryDescription,
      };
      setCategories([...categories, newCategory]);
    }
    handleCloseDialog();
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Category Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
      >
        Add New Category
      </Button>

      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(category)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCategory(category.id)}
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

      {/* Dialog for adding/editing category */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategory;
