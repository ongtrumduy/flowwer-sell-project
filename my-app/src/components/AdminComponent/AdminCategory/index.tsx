import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import CategoryApiService from '@services/api/category';
import { InterfaceCategoryDetailItemMetaData, InterfaceCategoryItem, InterfaceCategoryMetaData } from '@services/api/category/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import React, { useEffect, useState } from 'react';
import AdminPaginationCategoryList from './AdminPaginationCategoryList';
import ModalAddNewCategory from './ModalAddNewCategory';
import ModalDeleteCategory from './ModalDeleteCategory';
import ModalEditCategory from './ModalEditCategory';

const AdminCategory: React.FC = () => {
  // =============================================================================
  // =============================================================================
  const [categoryList, setCategoryList] = useState<InterfaceCategoryItem[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  // const [roleList, setRoleList] = useState<{ roleName: string; roleId: string }[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<InterfaceCategoryItem>({
    category_name: '',
    category_description: '',
    categoryId: '',
  });

  const [openAddNewPopup, setOpenAddNewPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);

  const [deleteCategoryId, setDeleteCategoryId] = useState('');

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

  const handleOpenEditPopup = ({ categoryId }: { categoryId: string | undefined }) => {
    if (categoryId) {
      CategoryApiService.getCategoryItemDetail_ForAdmin({ categoryId })
        .then((data) => {
          const categoryDetail = data as InterfaceCategoryDetailItemMetaData;

          setCategoryDetail(categoryDetail.categoryDetail);
        })
        .then(() => {
          setOpenEditPopup(true);
        });
    }
  };

  const handleOpenDeletePopup = ({ categoryId }: { categoryId: string | undefined }) => {
    if (categoryId) {
      setOpenDeletePopup(true);
      setDeleteCategoryId(categoryId);
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

  const handleGetCategoryList = () => {
    CategoryApiService.getAllCategoryList_ForAdmin(searchParams)
      .then((data) => {
        const categoryList = data as InterfaceCategoryMetaData;

        setCategoryList(categoryList.categories[0].data);
        setTotalSearchCount(categoryList.categories[0].overview[0].totalSearchCount);
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
    handleGetCategoryList();

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
          Quản lý Danh mục
        </Typography>

        <Card>
          <CardContent>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenAddNewPopup}>
              Thêm mới Danh mục
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
                  {categoryList.map((category) => (
                    <TableRow key={category.categoryId}>
                      <TableCell>{category.categoryId}</TableCell>
                      <TableCell>{category.category_name}</TableCell>
                      <TableCell>{category.category_description}</TableCell>

                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleOpenEditPopup({ categoryId: category?.categoryId })} sx={{ mr: 1 }}>
                          Sửa
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleOpenDeletePopup({ categoryId: category?.categoryId })}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <AdminPaginationCategoryList totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)} onPageChange={handlePageChange} />
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* // ============================================================================= */}
      <ModalAddNewCategory
        openAddNewPopup={openAddNewPopup}
        handleDialogClose={handleCloseAddNewPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleAddCategory={handleAddCategory}
        // control={control}
        // errors={errors}
        setOpenAddNewPopup={setOpenAddNewPopup}
        // handleGetCategoryList={handleGetCategoryList}
      />
      {/* // ============================================================================= */}
      <ModalEditCategory
        openEditPopup={openEditPopup}
        handleCloseEditPopup={handleCloseEditPopup}
        // roleList={roleList}
        // handleSubmit={handleSubmit}
        // handleEditCategory={handleEditCategory}
        // control={control}
        categoryDetail={categoryDetail}
        // reset={reset}
        setOpenEditPopup={setOpenEditPopup}
      />
      {/* // ============================================================================= */}
      <ModalDeleteCategory
        openDeletePopup={openDeletePopup}
        handleCloseDeletePopup={handleCloseDeletePopup}
        // handleDeleteCategory={handleDeleteCategory}
        deleteCategoryId={deleteCategoryId}
        setOpenDeletePopup={setOpenDeletePopup}
      />
      {/* // ============================================================================= */}
    </>
  );
};

export default AdminCategory;
