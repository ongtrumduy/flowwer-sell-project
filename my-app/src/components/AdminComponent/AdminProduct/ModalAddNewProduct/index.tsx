import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { InterfaceCategoryItem } from '@services/api/category/type';
import { InterfaceProductMetaData } from '@services/api/overview/type';
import ProductApiService from '@services/api/product';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InterfaceFormAddNewState } from '../type';
import productAddNewSchema from './yup';
import { useNavigate } from 'react-router-dom';

const ModalAddNewProduct = ({
  openAddNewPopup,
  setOpenAddNewPopup,
  handleDialogClose,
  categoryList,
  //   handleSubmit,
  //   handleAddProduct,
  //   control,
  //   errors,
  //   handleGetProductList,
}: {
  openAddNewPopup: boolean;
  setOpenAddNewPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleDialogClose: () => void;
  categoryList: InterfaceCategoryItem[] | undefined;
  //   handleSubmit: UseFormHandleSubmit<InterfaceFormAddNewState, undefined>;
  //   handleAddProduct: (data: InterfaceFormAddNewState) => void;
  //   errors: FieldErrors<InterfaceFormAddNewState>;
  //   control: Control<InterfaceFormAddNewState>;
  //   handleGetProductList: () => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product_name: '',
      product_quantity: 0,
      product_price: 0,
      product_description: '',
      product_category: [] as string[],
      product_image: undefined as File | undefined,
    },
    resolver: yupResolver(productAddNewSchema),
  });

  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleAddProduct = (data: InterfaceFormAddNewState) => {
    const newProduct: InterfaceFormAddNewState = {
      product_name: data.product_name,
      product_category: data.product_category,
      product_price: data.product_price,
      product_description: data?.product_description || '',
      product_image: data.product_image,
      product_quantity: data.product_quantity,
      // ? URL.createObjectURL(data.product_image)
      // : '',
    };

    // Tạo FormData
    const formData = new FormData();
    formData.append('product_name', data.product_name);
    formData.append('product_quantity', String(data.product_quantity));
    formData.append('product_price', String(data.product_price));
    formData.append('product_description', data?.product_description || '');

    if (data.product_image) {
      formData.append('product_image', data.product_image); // Đảm bảo giá trị là File
    }

    if (data.product_category && data.product_category.length) {
      data.product_category.forEach((category: Blob) => {
        formData.append('product_category[]', category); // Mảng category
      });
    }

    console.log('newProduct ===================>', newProduct);

    try {
      // Gửi dữ liệu đến API
      ProductApiService.createNewProduct({
        formData,
      })
        .then((data) => {
          const responseData = data as InterfaceProductMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetProductList();
        })
        .then(() => {
          navigate(0);
          setOpenAddNewPopup(false);

          // Reset trạng thái form
          reset(); // Reset form fields
        });
    } catch (error) {
      console.error('Error while adding product:', error);
    }
  };

  return (
    <>
      <Dialog open={openAddNewPopup} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm mới sản phẩm</DialogTitle>
        <form onSubmit={handleSubmit(handleAddProduct)}>
          <DialogContent>
            <Controller
              name="product_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên sản phẩm"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.product_name}
                  helperText={errors.product_name?.message}
                />
              )}
            />

            <Controller
              name="product_quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số lượng"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.product_quantity}
                  helperText={errors.product_quantity?.message}
                />
              )}
            />

            <Controller
              name="product_price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Giá"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.product_price}
                  helperText={errors.product_price?.message}
                />
              )}
            />

            <Controller
              name="product_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả sản phẩm"
                  variant="outlined"
                  fullWidth
                  multiline
                  required
                  rows={4}
                  margin="normal"
                  error={!!errors.product_description}
                  helperText={errors.product_description?.message}
                />
              )}
            />

            <Controller
              name="product_category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.product_category}>
                  <InputLabel sx={{ background: 'white !important', padding: '0 8px !important' }}>Danh mục sản phẩm</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const category = categoryList?.find((item) => item.categoryId === value);
                          return <Chip key={value} label={category?.category_name || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {categoryList?.length ? (
                      categoryList.map((category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.category_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Không có danh mục nào</MenuItem>
                    )}
                  </Select>
                  {errors.product_category && <p style={{ color: 'red' }}>{errors.product_category.message}</p>}
                </FormControl>
              )}
            />

            <Controller
              name="product_image"
              control={control}
              render={({ field }) => (
                <>
                  <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                    Tải ảnh sản phẩm
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        field.onChange(file);
                        setPreviewUrl(file ? URL.createObjectURL(file) : '');
                      }}
                    />
                  </Button>
                  {errors.product_image && <p style={{ color: 'red' }}>{errors.product_image.message}</p>}
                </>
              )}
            />

            {previewUrl && (
              <>
                <p>Xem trước ảnh:</p> <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', height: 'auto' }} />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ModalAddNewProduct;
