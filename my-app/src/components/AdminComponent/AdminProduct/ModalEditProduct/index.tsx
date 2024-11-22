import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { InterfaceCategoryItem } from '@services/api/category/type';
import ProductApiService from '@services/api/product';
import { InterfaceProductItem, InterfaceProductMetaData } from '@services/api/product/type';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InterfaceFormEditState, InterfaceSubmitFormEditState } from '../type';
import productEditSchema from './yup';

const ModalEditProduct = ({
  openEditPopup,
  categoryList,
  handleCloseEditPopup,
  // handleSubmit,
  // handleEditProduct,
  // control,
  productDetail,
  // reset,
  setOpenEditPopup,
}: {
  openEditPopup: boolean;
  categoryList: InterfaceCategoryItem[] | undefined;
  handleCloseEditPopup: () => void;
  // handleSubmit: UseFormHandleSubmit<InterfaceFormAddNewState>;
  // handleEditProduct: (data: InterfaceFormAddNewState) => void;
  // control: Control<
  //   {
  //     product_name: string;
  //     product_quantity: number;
  //     product_price: number;
  //     product_description: string;
  //     product_category: string[];
  //     product_image: File;
  //   },
  //   unknown
  // >;
  productDetail: InterfaceProductItem;
  // reset: UseFormReset<InterfaceFormAddNewState>;
  setOpenEditPopup: React.Dispatch<React.SetStateAction<boolean>>;
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
    resolver: yupResolver(productEditSchema),
  });

  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleEditProduct = (data: InterfaceSubmitFormEditState) => {
    const newProduct: InterfaceSubmitFormEditState = {
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
      (data.product_category as Blob[]).forEach((category: Blob) => {
        formData.append('product_category[]', category); // Mảng category
      });
    }

    console.log('newProduct ===================>', newProduct);

    try {
      // Gửi dữ liệu đến API
      ProductApiService.updateProduct({
        formData,
        productId: productDetail.productId,
      })
        .then((data) => {
          const responseData = data as InterfaceProductMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetProductList();
        })
        .then(() => {
          navigate(0);
          setOpenEditPopup(false);

          // Reset trạng thái form
          reset(); // Reset form fields
        });
    } catch (error) {
      console.error('Error while adding product:', error);
    }
  };

  useEffect(() => {
    if (productDetail) {
      const temp = cloneDeep(productDetail) as unknown as InterfaceFormEditState;
      temp.product_category = productDetail.product_category_list
        ? productDetail.product_category_list.map((item) => {
            return item._id;
          })
        : [];
      temp.product_type = productDetail.product_category_list
        ? productDetail.product_category_list.map((item) => {
            return item._id;
          })
        : [];

      if (productDetail.product_image) {
        setPreviewUrl(productDetail.product_image);
      }

      reset(temp, {
        // keepDirty: true,
        // keepTouched: true,
        // keepValues: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(productDetail)]);

  return (
    <>
      <Dialog
        open={openEditPopup}
        // onClose={handleCloseEditPopup}
        fullWidth
        maxWidth="sm"
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseEditPopup();
          }
        }}
      >
        <DialogTitle>Sửa sản phẩm</DialogTitle>
        <form onSubmit={handleSubmit(handleEditProduct)}>
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
            <Button onClick={handleCloseEditPopup} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ModalEditProduct;
