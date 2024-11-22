import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CategoryApiService from '@services/api/category';
import { InterfaceCategoryItem, InterfaceCategoryMetaData } from '@services/api/category/type';
import ProductApiService from '@services/api/product';
import { InterfaceProductDetailItemMetaData, InterfaceProductItem, InterfaceProductMetaData } from '@services/api/product/type';
import { DEFAULT_LIMIT, DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, DEFAULT_PAGE } from '@utils/constant';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import ModalAddNewProduct from './ModalAddNewProduct';
import ModalDeleteProduct from './ModalDeleteProduct';
import ModalEditProduct from './ModalEditProduct';
import AdminPaginationProductList from './AdminPaginationProductList';

const AdminProduct: React.FC = () => {
  // =============================================================================
  // =============================================================================
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     product_name: '',
  //     product_quantity: 0,
  //     product_price: 0,
  //     product_description: '',
  //     product_category: [] as string[],
  //     product_image: undefined as File | undefined,
  //   },
  //   resolver: yupResolver(productSchema),
  // });

  // =============================================================================
  // =============================================================================
  const [productList, setProductList] = useState<InterfaceProductItem[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    selectedCategory: '',
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  const [categoryList, setCategoryList] = useState<InterfaceCategoryItem[]>([]);
  const [productDetail, setProductDetail] = useState<InterfaceProductItem>({
    product_name: '',
    product_quantity: 0,
    product_price: 0,
    product_image: '',
    product_description: '',
    productId: '',
    product_category: [],
  });

  const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState('');

  //============================================================================
  //============================================================================
  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  const handleOpenAddNewPopup = () => {
    setOpenAddNewPopup(true);
  };

  const handleOpenEditPopup = ({ productId }: { productId: string | undefined }) => {
    console.log(`Edit product with productId ${productId}`);

    if (productId) {
      ProductApiService.getProductItemDetail({ productId })
        .then((data) => {
          const productDetail = data as InterfaceProductDetailItemMetaData;

          setProductDetail(productDetail.productDetail);
        })
        .then(() => {
          setOpenEditPopup(true);
        });
    }
  };

  const handleOpenDeletePopup = ({ productId }: { productId: string | undefined }) => {
    if (productId) {
      // ProductApiService.getProductItemDetail({ productId }).then((data) => {
      //   const productDetail = data as InterfaceProductDetailItemMetaData;

      //   setProductDetail(productDetail.productDetail);
      // });

      setOpenDeletePopup(true);
      setDeleteProductId(productId);
    }
  };

  const handleCloseAddNewPopup = () => {
    setOpenAddNewPopup(false);
  };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
  };

  const handleCloseDeletePopup = () => {
    setOpenDeletePopup(false);
  };

  // =============================================================================
  // =============================================================================
  // const handleAddProduct = (data: InterfaceFormAddNewState) => {
  //   const newProduct: InterfaceFormAddNewState = {
  //     product_name: data.product_name,
  //     product_category: data.product_category,
  //     product_price: data.product_price,
  //     product_description: data?.product_description || '',
  //     product_image: data.product_image,
  //     product_quantity: data.product_quantity,
  //     // ? URL.createObjectURL(data.product_image)
  //     // : '',
  //   };

  //   // Tạo FormData
  //   const formData = new FormData();
  //   formData.append('product_name', data.product_name);
  //   formData.append('product_quantity', String(data.product_quantity));
  //   formData.append('product_price', String(data.product_price));
  //   formData.append('product_description', data?.product_description || '');

  //   if (data.product_image) {
  //     formData.append('product_image', data.product_image); // Đảm bảo giá trị là File
  //   }

  //   if (data.product_category && data.product_category.length) {
  //     data.product_category.forEach((category: unknown) => {
  //       formData.append('product_category[]', new Blob(category as BlobPart[])); // Mảng category
  //     });
  //   }

  //   console.log('newProduct ===================>', newProduct);

  //   try {
  //     // Gửi dữ liệu đến API
  //     ProductApiService.createNewProduct({
  //       formData,
  //     }).then((data) => {
  //       const responseData = data as InterfaceProductMetaData;

  //       console.log('responseData ====================>', responseData);

  //       ProductApiService.getAllProductList(searchParams)
  //         .then((data) => {
  //           const productList = data as InterfaceProductMetaData;

  //           setProductList(productList.products[0].data);
  //           setTotalSearchCount(productList.products[0].overview[0].totalSearchCount);
  //         })
  //         .catch(() => {})
  //         .finally(() => {
  //           setSearchParams((searchParams) => {
  //             return { ...searchParams, isPendingCall: false };
  //           });
  //         });
  //     });

  //     // Reset trạng thái form
  //     setOpenAddNewPopup(false);
  //     reset(); // Reset form fields
  //   } catch (error) {
  //     console.error('Error while adding product:', error);
  //   }
  // };

  // const handleEditProduct = (data: InterfaceProductFormData) => {
  //   if (!data.product_image) {
  //     toast.error('Vui lòng chọn hình ảnh cho sản phẩm !!!');
  //   }

  //   const newProduct: InterfaceProductFormData = {
  //     product_name: data.product_name,
  //     product_category: data.product_category,
  //     product_price: data.product_price,
  //     product_description: data.product_description,
  //     product_image: data.product_image,
  //     product_quantity: data.product_quantity,
  //     // ? URL.createObjectURL(data.product_image)
  //     // : '',
  //   };

  //   // Tạo FormData
  //   const formData = new FormData();
  //   formData.append('product_name', data.product_name);
  //   formData.append('product_quantity', String(data.product_quantity));
  //   formData.append('product_price', String(data.product_price));
  //   formData.append('product_description', data?.product_description || '');

  //   if (data.product_image) {
  //     formData.append('product_image', data.product_image); // Đảm bảo giá trị là File
  //   }

  //   if (data.product_category && data.product_category.length) {
  //     data.product_category.forEach((category: string | Blob) => {
  //       formData.append('product_category[]', category); // Mảng category
  //     });
  //   }

  //   console.log('newProduct ===================>', newProduct);

  //   try {
  //     // Gửi dữ liệu đến API
  //     ProductApiService.createNewProduct({
  //       formData,
  //     }).then((data) => {
  //       const responseData = data as InterfaceProductMetaData;

  //       console.log('responseData ====================>', responseData);

  //       ProductApiService.getAllProductList(searchParams)
  //         .then((data) => {
  //           const productList = data as InterfaceProductMetaData;

  //           setProductList(productList.products[0].data);
  //           setTotalSearchCount(productList.products[0].overview[0].totalSearchCount);
  //         })
  //         .catch(() => {})
  //         .finally(() => {
  //           setSearchParams((searchParams) => {
  //             return { ...searchParams, isPendingCall: false };
  //           });
  //         });
  //     });

  //     // Reset trạng thái form
  //     setOpenEditPopup(false);
  //     reset(); // Reset form fields
  //   } catch (error) {
  //     console.error('Error while adding product:', error);
  //   }
  // };

  // const handleDeleteProduct = () => {
  //   ProductApiService.deleteProduct({ productId: deleteProductId })
  //     .then((data) => {
  //       const productList = data as InterfaceProductMetaData;

  //       console.log(`Edit product with productList ${productList}`);
  //     })
  //     .catch(() => {})
  //     .finally(() => {
  //       setDeleteProductId('');
  //     });

  //   setOpenDeletePopup(false); // Đóng popup
  // };

  const handleGetProductList = () => {
    ProductApiService.getAllProductList(searchParams)
      .then((data) => {
        const productList = data as InterfaceProductMetaData;

        setProductList(productList.products[0].data);
        setTotalSearchCount(productList.products[0].overview[0].totalSearchCount);
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
    handleGetProductList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  useEffect(() => {
    CategoryApiService.getAllCategoryList()
      .then((data) => {
        const categoryList = data as InterfaceCategoryMetaData;

        setCategoryList(() => {
          return [...categoryList.categories[0].data];
        });
      })
      .catch(() => {});
  }, []);

  //============================================================================
  //============================================================================
  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý sản phẩm
        </Typography>

        <Card>
          <CardContent>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddNewPopup}>
              Thêm mới sản phẩm
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell> */}
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ảnh</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow key={product.productId}>
                      {/* <TableCell>{product.productId}</TableCell> */}
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>
                        <img src={product.product_image as string} alt="" width={100} height={100} />
                      </TableCell>
                      <TableCell>{product.product_quantity}</TableCell>
                      <TableCell>{product.product_description}</TableCell>
                      <TableCell>
                        <NumericFormat
                          value={Number(product.product_price || 0)}
                          thousandSeparator={'.'}
                          decimalSeparator={','}
                          displayType={'text'}
                          suffix={' VNĐ'}
                          className="money"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleOpenEditPopup({ productId: product?.productId })} sx={{ mr: 1 }}>
                          Sửa
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleOpenDeletePopup({ productId: product?.productId })}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <AdminPaginationProductList totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)} onPageChange={handlePageChange} />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* // ============================================================================= */}
      <ModalAddNewProduct
        openAddNewPopup={openAddNewPopup}
        handleDialogClose={handleCloseAddNewPopup}
        categoryList={categoryList}
        // handleSubmit={handleSubmit}
        // handleAddProduct={handleAddProduct}
        // control={control}
        // errors={errors}
        setOpenAddNewPopup={setOpenAddNewPopup}
        // handleGetProductList={handleGetProductList}
      />
      {/* // ============================================================================= */}
      <ModalEditProduct
        openEditPopup={openEditPopup}
        handleCloseEditPopup={handleCloseEditPopup}
        categoryList={categoryList}
        // handleSubmit={handleSubmit}
        // handleEditProduct={handleEditProduct}
        // control={control}
        productDetail={productDetail}
        // reset={reset}
        setOpenEditPopup={setOpenEditPopup}
      />
      {/* // ============================================================================= */}
      <ModalDeleteProduct
        openDeletePopup={openDeletePopup}
        handleCloseDeletePopup={handleCloseDeletePopup}
        // handleDeleteProduct={handleDeleteProduct}
        deleteProductId={deleteProductId}
        setOpenDeletePopup={setOpenDeletePopup}
      />
      {/* // ============================================================================= */}
    </>
  );
};

export default AdminProduct;
