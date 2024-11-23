import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import typeProductEditSchema from './yup';
import {
  InterfaceFormTypeProductDetail,
  InterfaceSubmitFormEditState,
} from '../type';
import {
  InterfaceTypeProductItem,
  InterfaceTypeProductMetaData,
} from '@services/api/type_product/type';
import TypeProductApiService from '@services/api/type_product';

const ModalEditTypeProduct = ({
  openEditPopup,
  handleCloseEditPopup,
  typeProductDetail,
  setOpenEditPopup,
}: {
  openEditPopup: boolean;
  handleCloseEditPopup: () => void;
  typeProductDetail: InterfaceTypeProductItem;
  setOpenEditPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type_product_name: '',
      type_product_description: '',
    },
    resolver: yupResolver(typeProductEditSchema),
  });

  const navigate = useNavigate();

  const handleEditTypeProduct = (data: InterfaceSubmitFormEditState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('type_product_name', data.type_product_name);
    formData.append(
      'type_product_description',
      String(data.type_product_description)
    );
    // formData.append('typeProduct_phone_number', String(data.typeProduct_phone_number));

    // if (data.typeProduct_avatar) {
    //   formData.append('typeProduct_avatar', data.typeProduct_avatar); // Đảm bảo giá trị là File
    // }

    // if (data.typeProduct_role && data.typeProduct_role.length) {
    //   data.typeProduct_role.forEach((role: Blob) => {
    //     formData.append('typeProduct_role[]', role);
    //   });
    // }

    try {
      // Gửi dữ liệu đến API
      TypeProductApiService.updateTypeProduct_ForAdmin({
        formData,
        typeProductId: typeProductDetail.typeProductId,
      })
        .then((data) => {
          const responseData = data as InterfaceTypeProductMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetTypeProductList();
        })
        .then(() => {
          navigate(0);
          setOpenEditPopup(false);

          // Reset trạng thái form
          reset(); // Reset form fields
        });
    } catch (error) {
      console.error('Error while adding typeProduct:', error);
    }
  };

  useEffect(() => {
    if (typeProductDetail) {
      const temp = cloneDeep(
        typeProductDetail
      ) as unknown as InterfaceFormTypeProductDetail;
      // temp.typeProduct_role = typeProductDetail.typeProduct_role
      //   ? typeProductDetail.typeProduct_role.map((item) => {
      //       return item;
      //     })
      //   : [];

      // if (typeProductDetail.typeProduct_avatar) {
      //   setPreviewUrl(typeProductDetail.typeProduct_avatar);
      // }

      reset(temp, {
        // keepDirty: true,
        // keepTouched: true,
        // keepValues: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(typeProductDetail)]);

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
        <form onSubmit={handleSubmit(handleEditTypeProduct)}>
          <DialogContent>
            <Controller
              name="type_product_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên tài khoản"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.type_product_name}
                  helperText={errors.type_product_name?.message}
                />
              )}
            />

            <Controller
              name="type_product_description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mô tả"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.type_product_description}
                  helperText={errors.type_product_description?.message}
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

export default ModalEditTypeProduct;
