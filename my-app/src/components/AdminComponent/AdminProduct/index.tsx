import PaginationProductList from '@components/UserComponent/PaginationProductList';
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
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CategoryApiService from '@services/api/category';
import {
  InterfaceCategoryItem,
  InterfaceCategoryMetaData,
} from '@services/api/category/type';
import ProductApiService from '@services/api/product';
import {
  InterfaceProductDetailItemMetaData,
  InterfaceProductItem,
  InterfaceProductMetaData,
} from '@services/api/product/type';
import {
  DEFAULT_LIMIT,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
} from '@utils/constant';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface Product {
  productId?: string;
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_category?: string[];
  product_description: string;
  product_image: File | null;
}

const AdminProduct: React.FC = () => {
  const [productList, setProductList] = useState<InterfaceProductItem[]>([]);
  const [open, setOpen] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState('');

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      product_name: '',
      product_quantity: 0,
      product_price: 0,
      product_description: '',
      product_category: [] as string[],
      product_image: null as File | null,
    },
  });

  const [searchParams, setSearchParams] = useState({
    searchName: '',
    selectedCategory: '',
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [totalSearchCount, setTotalSearchCount] = useState(0);

  const [categoryList, setCategoryList] = useState<InterfaceCategoryItem[]>([
    // {
    //   category_name: 'Tất cả',
    //   categoryId: DEFAULT_CATEGORY_ID,
    //   category_description: 'Tất cả',
    // },
  ]);

  const [productDetail, setProductDetail] = useState<InterfaceProductItem>({
    product_name: '',
    product_quantity: 0,
    product_price: 0,
    product_image: '',
    product_description: '',
    productId: '',
    product_category: [],
  });

  const handleAddProduct = (data: Product) => {
    const newProduct: Product = {
      product_name: data.product_name,
      product_category: data.product_category,
      product_price: data.product_price,
      product_description: data.product_description,
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
    formData.append('product_description', data.product_description);

    if (data.product_image) {
      formData.append('product_image', data.product_image); // Đảm bảo giá trị là File
    }

    if (data.product_category && data.product_category.length) {
      data.product_category.forEach((category) => {
        formData.append('product_category[]', category); // Mảng category
      });
    }

    // setProducts((prev) => [...prev, newProduct]);

    console.log('newProduct ===================>', newProduct);

    try {
      // Gửi dữ liệu đến API
      ProductApiService.createNewProduct({
        formData,
      }).then((data) => {
        const responseData = data as InterfaceProductMetaData;

        console.log('responseData ====================>', responseData);

        ProductApiService.getAllProductList(searchParams)
          .then((data) => {
            const productList = data as InterfaceProductMetaData;

            setProductList(productList.products[0].data);
            setTotalSearchCount(
              productList.products[0].overview[0].totalSearchCount
            );
          })
          .catch(() => {})
          .finally(() => {
            setSearchParams((searchParams) => {
              return { ...searchParams, isPendingCall: false };
            });
          });
      });

      // Reset trạng thái form
      setOpen(false);
      reset(); // Reset form fields
    } catch (error) {
      console.error('Error while adding product:', error);
    }
  };

  useEffect(() => {
    if (productDetail) {
      const temp = cloneDeep(productDetail) as Product;

      temp.product_image = null;

      reset(temp, {
        keepDirty: true,
        keepTouched: true,
        keepValues: true,
      });
    }
  }, [JSON.stringify(productDetail)]);

  const handleEdit = ({ productId }: { productId: string | undefined }) => {
    console.log(`Edit product with productId ${productId}`);

    if (productId) {
      ProductApiService.getProductItemDetail({ productId }).then((data) => {
        const productDetail = data as InterfaceProductDetailItemMetaData;

        setProductDetail(productDetail.productDetail);

        handleDialogOpen();
      });
    }
  };

  const handleDelete = ({ productId }: { productId: string | undefined }) => {
    if (productId) {
      // ProductApiService.getProductItemDetail({ productId }).then((data) => {
      //   const productDetail = data as InterfaceProductDetailItemMetaData;

      //   setProductDetail(productDetail.productDetail);
      // });

      handleOpenDelete();
      setDeleteProductId(productId);
    }
  };

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  useEffect(() => {
    ProductApiService.getAllProductList(searchParams)
      .then((data) => {
        const productList = data as InterfaceProductMetaData;

        setProductList(productList.products[0].data);
        setTotalSearchCount(
          productList.products[0].overview[0].totalSearchCount
        );
      })
      .catch(() => {})
      .finally(() => {
        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  useEffect(() => {
    CategoryApiService.getAllCategoryList()
      .then((data) => {
        const categoryList = data as InterfaceCategoryMetaData;

        setCategoryList((prev) => {
          return [...prev, ...categoryList.categories[0].data];
        });
      })
      .catch(() => {});
  }, []);

  //============================================================================
  const [openDelete, setOpenDelete] = useState(false);

  // Mở popup
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  // Đóng popup
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // Xác nhận xóa
  const handleConfirmDelete = () => {
    ProductApiService.deleteProduct({ productId: deleteProductId })
      .then((data) => {
        const productList = data as InterfaceProductMetaData;

        console.log(`Edit product with productList ${productList}`);
      })
      .catch(() => {})
      .finally(() => {
        setDeleteProductId('');
      });

    setOpenDelete(false); // Đóng popup
  };

  //============================================================================

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý sản phẩm
        </Typography>

        <Card>
          <CardContent>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={handleDialogOpen}
            >
              Thêm mới sản phẩm
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ảnh</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                    {/* <TableCell>Danh mục</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>{product.productId}</TableCell>{' '}
                      <TableCell>
                        <img
                          src={product.product_image as string}
                          alt=""
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      {/* <TableCell>
                      {product.product_category.map((c) => {
                        return c;
                      })}
                    </TableCell> */}
                      <TableCell>${product.product_price}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleEdit({ productId: product?.productId })
                          }
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            handleDelete({ productId: product?.productId })
                          }
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Card sx={{ mt: 4 }}>
              <PaginationProductList
                totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)}
                onPageChange={handlePageChange}
              />
            </Card>
          </CardContent>
        </Card>
      </Box>

      {/* Dialog for Adding Product */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm mới sản phẩm</DialogTitle>
        <form onSubmit={handleSubmit(handleAddProduct)}>
          <DialogContent>
            <Controller
              name="product_name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Tên sản phẩm"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="product_quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Số lượng"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="product_category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Danh mục sản phẩm</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {categoryList.map((category) => (
                      <MenuItem
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="product_price"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Giá"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  {...field}
                />
              )}
            />{' '}
            <Controller
              name="product_quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Số lượng"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="product_description"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Mô tả sản phẩm"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  {...field}
                />
              )}
            />
            <Controller
              name="product_image"
              control={control}
              render={({ field }) => (
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Tải ảnh sản phẩm
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;

                      field.onChange(file);
                      setPreviewUrl(URL.createObjectURL(file as Blob));
                    }}
                  />
                </Button>
              )}
            />
            {previewUrl && (
              <>
                <p>Xem trước ảnh:</p>{' '}
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '300px' }}
                />
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

      {/* Popup xác nhận */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProduct;
