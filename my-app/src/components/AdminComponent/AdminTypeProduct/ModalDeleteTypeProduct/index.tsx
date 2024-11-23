import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import TypeProductApiService from '@services/api/type_product';
import { InterfaceTypeProductMetaData } from '@services/api/type_product/type';
import { useNavigate } from 'react-router-dom';

const ModalDeleteTypeProduct = ({
  openDeletePopup,
  handleCloseDeletePopup,
  // handleDeleteTypeProduct,
  deleteTypeProductId,
  setOpenDeletePopup,
}: {
  openDeletePopup: boolean;
  handleCloseDeletePopup: () => void;
  // handleDeleteTypeProduct: () => void;
  deleteTypeProductId: string;
  setOpenDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleDeleteTypeProduct = () => {
    TypeProductApiService.deleteTypeProduct_ForAdmin({
      typeProductId: deleteTypeProductId,
    })
      .then((data) => {
        const typeProductList = data as InterfaceTypeProductMetaData;
        navigate(0);
        console.log(`Edit typeProduct with typeProductList ${typeProductList}`);

        setOpenDeletePopup(false);
      })
      .catch(() => {})
      .finally(() => {});
  };

  return (
    <>
      {/* Popup xác nhận */}
      <Dialog
        open={openDeletePopup}
        onClose={handleCloseDeletePopup}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa Danh mục này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteTypeProduct}
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

export default ModalDeleteTypeProduct;
