// import { yupResolver } from '@hookform/resolvers/yup';
// import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import OrderApiService from '@services/api/order';
// import { InterfaceOrderItem, InterfaceOrderMetaData } from '@services/api/order/type';
// import { cloneDeep } from 'lodash';
// import { useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { InterfaceFormOrderDetail, InterfaceSubmitFormEditState } from '../type';
// import orderEditSchema from './yup';

// const ModalEditOrder = ({
//   openEditPopup,
//   // roleList,
//   handleCloseEditPopup,
//   orderDetail,
//   setOpenEditPopup,
// }: {
//   openEditPopup: boolean;
//   // roleList: { roleId: string; roleName: string }[] | undefined;
//   handleCloseEditPopup: () => void;
//   orderDetail: InterfaceOrderItem;
//   setOpenEditPopup: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       order_name: '',
//       order_email: '',
//       order_phone_number: '',
//       order_avatar: '',
//       order_address: '',
//       order_role: [],
//     },
//     resolver: yupResolver(orderEditSchema),
//   });

//   const navigate = useNavigate();

//   const [previewUrl, setPreviewUrl] = useState<string>('');

//   const handleEditOrder = (data: InterfaceSubmitFormEditState) => {
//     // Tạo FormData
//     const formData = new FormData();
//     formData.append('order_name', data.order_name);
//     formData.append('order_email', String(data.order_email));
//     formData.append('order_phone_number', String(data.order_phone_number));

//     if (data.order_avatar) {
//       formData.append('order_avatar', data.order_avatar); // Đảm bảo giá trị là File
//     }

//     if (data.order_role && data.order_role.length) {
//       data.order_role.forEach((role: Blob) => {
//         formData.append('order_role[]', role);
//       });
//     }

//     try {
//       // Gửi dữ liệu đến API
//       OrderApiService.updateOrder({
//         formData,
//         orderId: orderDetail.orderId,
//       })
//         .then((data) => {
//           const responseData = data as InterfaceOrderMetaData;

//           console.log('responseData ====================>', responseData);

//           // handleGetOrderList();
//         })
//         .then(() => {
//           navigate(0);
//           setOpenEditPopup(false);

//           // Reset trạng thái form
//           reset(); // Reset form fields
//         });
//     } catch (error) {
//       console.error('Error while adding order:', error);
//     }
//   };

//   useEffect(() => {
//     if (orderDetail) {
//       const temp = cloneDeep(orderDetail) as unknown as InterfaceFormOrderDetail;
//       temp.order_role = orderDetail.order_role
//         ? orderDetail.order_role.map((item) => {
//             return item;
//           })
//         : [];

//       if (orderDetail.order_avatar) {
//         setPreviewUrl(orderDetail.order_avatar);
//       }

//       reset(temp, {
//         // keepDirty: true,
//         // keepTouched: true,
//         // keepValues: true,
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(orderDetail)]);

//   return (
//     <>
//       <Dialog
//         open={openEditPopup}
//         fullWidth
//         maxWidth="sm"
//         onClose={(event, reason) => {
//           if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
//             handleCloseEditPopup();
//           }
//         }}
//       >
//         <DialogTitle>Sửa Đơn hàng</DialogTitle>
//         <form onSubmit={handleSubmit(handleEditOrder)}>
//           <DialogContent>
//             <Controller
//               name="order_name"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Tên tài khoản"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   required
//                   error={!!errors.order_name}
//                   helperText={errors.order_name?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="order_email"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Email"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   required
//                   error={!!errors.order_email}
//                   helperText={errors.order_email?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="order_phone_number"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Số điện thoại"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
//                   required
//                   error={!!errors.order_phone_number}
//                   helperText={errors.order_phone_number?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="order_address"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Địa chỉ"
//                   variant="outlined"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   margin="normal"
//                   error={!!errors.order_address}
//                   helperText={errors.order_address?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="order_role"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth margin="normal" error={!!errors.order_role}>
//                   <InputLabel sx={{ background: 'white !important', padding: '0 8px !important' }}>Phân quyền</InputLabel>
//                   <Select
//                     multiple
//                     value={field.value}
//                     onChange={field.onChange}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {(selected as string[]).map((value) => {
//                           const role = roleList?.find((item) => item.roleId === value);
//                           return <Chip key={value} label={role?.roleName || value} />;
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {roleList?.length ? (
//                       roleList.map((role) => (
//                         <MenuItem key={role.roleId} value={role.roleId}>
//                           {role.roleName}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>Không có phân quyền nào</MenuItem>
//                     )}
//                   </Select>
//                   {errors.order_role && <p style={{ color: 'red' }}>{errors.order_role.message}</p>}
//                 </FormControl>
//               )}
//             />

//             <Controller
//               name="order_avatar"
//               control={control}
//               render={({ field }) => (
//                 <>
//                   <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
//                     Tải ảnh đại diện
//                     <input
//                       type="file"
//                       accept="image/*"
//                       hidden
//                       onChange={(e) => {
//                         const file = e.target.files ? e.target.files[0] : null;
//                         field.onChange(file);
//                         setPreviewUrl(file ? URL.createObjectURL(file) : '');
//                       }}
//                     />
//                   </Button>
//                   {errors.order_avatar && <p style={{ color: 'red' }}>{errors.order_avatar.message}</p>}
//                 </>
//               )}
//             />

//             {previewUrl && (
//               <>
//                 <p>Xem trước ảnh:</p> <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', height: 'auto' }} />
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEditPopup} color="secondary">
//               Hủy
//             </Button>
//             <Button type="submit" variant="contained" color="primary">
//               Cập nhật
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </>
//   );
// };

// export default ModalEditOrder;
