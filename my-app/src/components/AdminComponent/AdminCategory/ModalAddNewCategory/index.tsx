import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CategoryApiService from '@services/api/category';
import { InterfaceCategoryMetaData } from '@services/api/category/type';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InterfaceSubmitFormAddState } from '../type';
import categoryAddNewSchema from './yup';

const ModalAddNewCategory = ({
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
      category_name: '',
      category_description: '',
    },
    resolver: yupResolver(categoryAddNewSchema),
  });

  const navigate = useNavigate();

  // const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleAddCategory = (data: InterfaceSubmitFormAddState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('category_name', data.category_name);
    formData.append('category_description', String(data.category_description));

    try {
      // Gửi dữ liệu đến API
      CategoryApiService.createNewCategory_ForAdmin({
        formData,
      })
        .then((data) => {
          const responseData = data as InterfaceCategoryMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetCategoryList();
        })
        .then(() => {
          navigate(0);
          setOpenAddNewPopup(false);

          reset();
        });
    } catch (error) {
      console.error('Error while adding category:', error);
    }
  };

  return (
    <>
      <Dialog open={openAddNewPopup} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm mới Danh mục</DialogTitle>
        <form onSubmit={handleSubmit(handleAddCategory)}>
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

export default ModalAddNewCategory;
