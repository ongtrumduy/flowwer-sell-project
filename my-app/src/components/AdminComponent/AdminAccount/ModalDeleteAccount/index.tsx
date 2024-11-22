import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AccountApiService from '@services/api/account';
import { InterfaceAccountMetaData } from '@services/api/account/type';
import { useNavigate } from 'react-router-dom';

const ModalDeleteAccount = ({
  openDeletePopup,
  handleCloseDeletePopup,
  // handleDeleteAccount,
  deleteAccountId,
  setOpenDeletePopup,
}: {
  openDeletePopup: boolean;
  handleCloseDeletePopup: () => void;
  // handleDeleteAccount: () => void;
  deleteAccountId: string;
  setOpenDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    AccountApiService.deleteAccount({ accountId: deleteAccountId })
      .then((data) => {
        const accountList = data as InterfaceAccountMetaData;
        navigate(0);
        console.log(`Edit account with accountList ${accountList}`);

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
          <DialogContentText>Bạn có chắc chắn muốn xóa Tài khoản này không? Hành động này không thể hoàn tác.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePopup} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalDeleteAccount;
