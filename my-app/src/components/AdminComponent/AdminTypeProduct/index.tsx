import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import React, { useEffect, useState } from 'react';
import AdminPaginationTypeProductList from './AdminPaginationTypeProductList';
import ModalAddNewTypeProduct from './ModalAddNewTypeProduct';
import ModalDeleteTypeProduct from './ModalDeleteTypeProduct';
import ModalEditTypeProduct from './ModalEditTypeProduct';
import TypeProductApiService from '@services/api/type_product';
import {
  InterfaceTypeProductDetailItemMetaData,
  InterfaceTypeProductItem,
  InterfaceTypeProductMetaData,
} from '@services/api/type_product/type';

const AdminTypeProduct: React.FC = () => {
  // =============================================================================
  // =============================================================================
  const [typeProductList, setTypeProductList] = useState<
    InterfaceTypeProductItem[]
  >([]);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  // const [roleList, setRoleList] = useState<{ roleName: string; roleId: string }[]>([]);
  const [typeProductDetail, setTypeProductDetail] =
    useState<InterfaceTypeProductItem>({
      type_product_name: '',
      type_product_description: '',
      typeProductId: '',
    });

  const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const [deleteTypeProductId, setDeleteTypeProductId] = useState('');

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

  const handleOpenEditPopup = ({
    typeProductId,
  }: {
    typeProductId: string | undefined;
  }) => {
    if (typeProductId) {
      TypeProductApiService.getTypeProductItemDetail_ForAdmin({ typeProductId })
        .then((data) => {
          const typeProductDetail =
            data as InterfaceTypeProductDetailItemMetaData;

          setTypeProductDetail(typeProductDetail.typeProductDetail);
        })
        .then(() => {
          setOpenEditPopup(true);
        });
    }
  };

  const handleOpenDeletePopup = ({
    typeProductId,
  }: {
    typeProductId: string | undefined;
  }) => {
    if (typeProductId) {
      setOpenDeletePopup(true);
      setDeleteTypeProductId(typeProductId);
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

  const handleGetTypeProductList = () => {
    TypeProductApiService.getAllTypeProductList_ForAdmin(searchParams)
      .then((data) => {
        const typeProductList = data as InterfaceTypeProductMetaData;

        setTypeProductList(typeProductList.typeProducts[0].data);
        setTotalSearchCount(
          typeProductList.typeProducts[0].overview[0].totalSearchCount
        );
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
    handleGetTypeProductList();

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
          Quản lý Loại sản phẩm
        </Typography>

        <Card>
          <CardContent>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={handleOpenAddNewPopup}
            >
              Thêm mới Loại sản phẩm
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>

                    <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {typeProductList.map((typeProduct) => (
                    <TableRow key={typeProduct.typeProductId}>
                      <TableCell>{typeProduct.typeProductId}</TableCell>
                      <TableCell>{typeProduct.type_product_name}</TableCell>
                      <TableCell>
                        {typeProduct.type_product_description}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleOpenEditPopup({
                              typeProductId: typeProduct?.typeProductId,
                            })
                          }
                          sx={{ mr: 1 }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            handleOpenDeletePopup({
                              typeProductId: typeProduct?.typeProductId,
                            })
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

            <Box sx={{ mt: 4 }}>
              <AdminPaginationTypeProductList
                totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)}
                onPageChange={handlePageChange}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* // ============================================================================= */}
      <ModalAddNewTypeProduct
        openAddNewPopup={openAddNewPopup}
        handleDialogClose={handleCloseAddNewPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleAddTypeProduct={handleAddTypeProduct}
        // control={control}
        // errors={errors}
        setOpenAddNewPopup={setOpenAddNewPopup}
        // handleGetTypeProductList={handleGetTypeProductList}
      />
      {/* // ============================================================================= */}
      <ModalEditTypeProduct
        openEditPopup={openEditPopup}
        handleCloseEditPopup={handleCloseEditPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleEditTypeProduct={handleEditTypeProduct}
        // control={control}
        typeProductDetail={typeProductDetail}
        // reset={reset}
        setOpenEditPopup={setOpenEditPopup}
      />
      {/* // ============================================================================= */}
      <ModalDeleteTypeProduct
        openDeletePopup={openDeletePopup}
        handleCloseDeletePopup={handleCloseDeletePopup}
        // handleDeleteTypeProduct={handleDeleteTypeProduct}
        deleteTypeProductId={deleteTypeProductId}
        setOpenDeletePopup={setOpenDeletePopup}
      />
      {/* // ============================================================================= */}
    </>
  );
};

export default AdminTypeProduct;
