// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import OrderApiService from '@services/api/order';
// import { useNavigate } from 'react-router-dom';

// const ModalDeleteOrder = ({
//   openDeletePopup,
//   handleCloseDeletePopup,
//   // handleDeleteOrder,
//   deleteOrderId,
//   setOpenDeletePopup,
// }: {
//   openDeletePopup: boolean;
//   handleCloseDeletePopup: () => void;
//   // handleDeleteOrder: () => void;
//   deleteOrderId: string;
//   setOpenDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const navigate = useNavigate();

//   const handleDeleteOrder = () => {
//     OrderApiService.deleteOrder_ForAdmin({ orderId: deleteOrderId })
//       .then((data) => {
//         const orderList = data as InterfaceOrderMetaData;
//         navigate(0);
//         console.log(`Edit order with orderList ${orderList}`);

//         setOpenDeletePopup(false);
//       })
//       .catch(() => {})
//       .finally(() => {});
//   };

//   return (
//     <>
//       {/* Popup xác nhận */}
//       <Dialog open={openDeletePopup} onClose={handleCloseDeletePopup} aria-labelledby="delete-confirmation-dialog">
//         <DialogTitle id="delete-confirmation-dialog">Xác nhận xóa</DialogTitle>
//         <DialogContent>
//           <DialogContentText>Bạn có chắc chắn muốn xóa Đơn hàng này không? Hành động này không thể hoàn tác.</DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeletePopup} color="primary">
//             Hủy
//           </Button>
//           <Button onClick={handleDeleteOrder} color="secondary" variant="contained">
//             Xác nhận
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default ModalDeleteOrder;
