import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CategoryApiService from '@services/api/category';
import { InterfaceCategoryMetaData } from '@services/api/category/type';
import { useNavigate } from 'react-router-dom';

const ModalDeleteCategory = ({
  openDeletePopup,
  handleCloseDeletePopup,
  // handleDeleteCategory,
  deleteCategoryId,
  setOpenDeletePopup,
}: {
  openDeletePopup: boolean;
  handleCloseDeletePopup: () => void;
  // handleDeleteCategory: () => void;
  deleteCategoryId: string;
  setOpenDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleDeleteCategory = () => {
    CategoryApiService.deleteCategory_ForAdmin({ categoryId: deleteCategoryId })
      .then((data) => {
        const categoryList = data as InterfaceCategoryMetaData;
        navigate(0);
        console.log(`Edit category with categoryList ${categoryList}`);

        setOpenDeletePopup(false);
      })
      .catch(() => {})
      .finally(() => {});
  };

  return (
    <>
      {/* Popup xác nhận */}
      <Dialog open={openDeletePopup} onClose={handleCloseDeletePopup} aria-labelledby="delete-confirmation-dialog">
        <DialogTitle id="delete-confirmation-dialog">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa Danh mục này không? Hành động này không thể hoàn tác.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDeleteCategory;
