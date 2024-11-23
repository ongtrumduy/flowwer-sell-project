import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InterfaceSubmitFormAddState } from '../type';
import typeProductAddNewSchema from './yup';
import TypeProductApiService from '@services/api/type_product';
import { InterfaceTypeProductMetaData } from '@services/api/type_product/type';

const ModalAddNewTypeProduct = ({
  openAddNewPopup,
  setOpenAddNewPopup,
  handleDialogClose,
}: {
  openAddNewPopup: boolean;
  setOpenAddNewPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleDialogClose: () => void;
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
    resolver: yupResolver(typeProductAddNewSchema),
  });

  const navigate = useNavigate();

  // const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleAddTypeProduct = (data: InterfaceSubmitFormAddState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('typeProduct_name', data.type_product_name);
    formData.append(
      'typeProduct_description',
      String(data.type_product_description)
    );

    try {
      // Gửi dữ liệu đến API
      TypeProductApiService.createNewTypeProduct_ForAdmin({
        formData,
      })
        .then((data) => {
          const responseData = data as InterfaceTypeProductMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetTypeProductList();
        })
        .then(() => {
          navigate(0);
          setOpenAddNewPopup(false);

          reset();
        });
    } catch (error) {
      console.error('Error while adding typeProduct:', error);
    }
  };

  return (
    <>
      <Dialog
        open={openAddNewPopup}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thêm mới Danh mục</DialogTitle>
        <form onSubmit={handleSubmit(handleAddTypeProduct)}>
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

export default ModalAddNewTypeProduct;
