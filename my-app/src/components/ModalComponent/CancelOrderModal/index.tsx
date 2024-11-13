import { Box, Button, Modal, Typography } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOrderModal = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Xác nhận hủy
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Bạn có chắc chắn muốn hủy đơn hàng này không ???
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ marginRight: 2 }}
        >
          Xác nhận
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
      </Box>
    </Modal>
  );
};

export default CancelOrderModal;
