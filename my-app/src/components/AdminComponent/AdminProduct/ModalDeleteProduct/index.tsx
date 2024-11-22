import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { InterfaceProductMetaData } from '@services/api/overview/type';
import ProductApiService from '@services/api/product';
import { useNavigate } from 'react-router-dom';

const ModalDeleteProduct = ({
  openDeletePopup,
  handleCloseDeletePopup,
  // handleDeleteProduct,
  deleteProductId,
  setOpenDeletePopup,
}: {
  openDeletePopup: boolean;
  handleCloseDeletePopup: () => void;
  // handleDeleteProduct: () => void;
  deleteProductId: string;
  setOpenDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleDeleteProduct = () => {
    ProductApiService.deleteProduct({ productId: deleteProductId })
      .then((data) => {
        const productList = data as InterfaceProductMetaData;
        navigate(0);
        console.log(`Edit product with productList ${productList}`);

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
          <DialogContentText>Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteProduct} color="secondary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDeleteProduct;
