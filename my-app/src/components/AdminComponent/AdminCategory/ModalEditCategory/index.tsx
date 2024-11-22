import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CategoryApiService from '@services/api/category';
import { InterfaceCategoryItem, InterfaceCategoryMetaData } from '@services/api/category/type';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import categoryEditSchema from './yup';
import { InterfaceFormCategoryDetail, InterfaceSubmitFormEditState } from '../type';

const ModalEditCategory = ({
  openEditPopup,
  handleCloseEditPopup,
  categoryDetail,
  setOpenEditPopup,
}: {
  openEditPopup: boolean;
  handleCloseEditPopup: () => void;
  categoryDetail: InterfaceCategoryItem;
  setOpenEditPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: '',
      category_description: '',
    },
    resolver: yupResolver(categoryEditSchema),
  });

  const navigate = useNavigate();

  const handleEditCategory = (data: InterfaceSubmitFormEditState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('category_name', data.category_name);
    formData.append('category_description', String(data.category_description));
    // formData.append('category_phone_number', String(data.category_phone_number));

    // if (data.category_avatar) {
    //   formData.append('category_avatar', data.category_avatar); // Đảm bảo giá trị là File
    // }

    // if (data.category_role && data.category_role.length) {
    //   data.category_role.forEach((role: Blob) => {
    //     formData.append('category_role[]', role);
    //   });
    // }

    try {
      // Gửi dữ liệu đến API
      CategoryApiService.updateCategory_ForAdmin({
        formData,
        categoryId: categoryDetail.categoryId,
      })
        .then((data) => {
          const responseData = data as InterfaceCategoryMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetCategoryList();
        })
        .then(() => {
          navigate(0);
          setOpenEditPopup(false);

          // Reset trạng thái form
          reset(); // Reset form fields
        });
    } catch (error) {
      console.error('Error while adding category:', error);
    }
  };

  useEffect(() => {
    if (categoryDetail) {
      const temp = cloneDeep(categoryDetail) as unknown as InterfaceFormCategoryDetail;
      // temp.category_role = categoryDetail.category_role
      //   ? categoryDetail.category_role.map((item) => {
      //       return item;
      //     })
      //   : [];

      // if (categoryDetail.category_avatar) {
      //   setPreviewUrl(categoryDetail.category_avatar);
      // }

      reset(temp, {
        // keepDirty: true,
        // keepTouched: true,
        // keepValues: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(categoryDetail)]);

  return (
    <>
      <Dialog
        open={openEditPopup}
        fullWidth
        maxWidth="sm"
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseEditPopup();
          }
        }}
      >
        <DialogTitle>Sửa Danh mục</DialogTitle>
        <form onSubmit={handleSubmit(handleEditCategory)}>
          <DialogContent>
            <Controller
              name="category_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên tài khoản"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.category_name}
                  helperText={errors.category_name?.message}
                />
              )}
            />

            <Controller
              name="category_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.category_description}
                  helperText={errors.category_description?.message}
                />
              )}
            />
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

export default ModalEditCategory;
