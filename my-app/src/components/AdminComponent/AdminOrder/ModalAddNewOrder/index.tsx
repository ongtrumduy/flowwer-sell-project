import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import OrderApiService from '@services/api/order';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InterfaceSubmitFormAddState } from '../type';
import orderAddNewSchema from './yup';

const ModalAddNewOrder = ({
  openAddNewPopup,
  setOpenAddNewPopup,
  handleDialogClose,
  // roleList,
}: {
  openAddNewPopup: boolean;
  setOpenAddNewPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleDialogClose: () => void;
  // roleList: { roleId: string; roleName: string }[] | undefined;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      order_name: '',
      order_email: '',
      order_phone_number: '',
      order_avatar: '',
      order_address: '',
      order_role: [],
    },
    resolver: yupResolver(orderAddNewSchema),
  });

  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleAddOrder = (data: InterfaceSubmitFormAddState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('order_name', data.order_name);
    formData.append('order_email', String(data.order_email));
    formData.append('order_phone_number', String(data.order_phone_number));
    formData.append('order_address', String(data.order_address));

    if (data.order_role && data.order_role.length) {
      data.order_role.forEach((role: Blob) => {
        formData.append('order_role[]', role);
      });
    }

    try {
      // Gửi dữ liệu đến API
      OrderApiService.createNewOrder({
        formData,
      })
        .then((data) => {
          const responseData = data as InterfaceOrderMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetOrderList();
        })
        .then(() => {
          navigate(0);
          setOpenAddNewPopup(false);

          reset();
        });
    } catch (error) {
      console.error('Error while adding order:', error);
    }
  };

  return (
    <>
      <Dialog open={openAddNewPopup} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm mới Tài khoản</DialogTitle>
        <form onSubmit={handleSubmit(handleAddOrder)}>
          <DialogContent>
            <Controller
              name="order_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên tài khoản"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.order_name}
                  helperText={errors.order_name?.message}
                />
              )}
            />

            <Controller
              name="order_email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.order_email}
                  helperText={errors.order_email?.message}
                />
              )}
            />

            <Controller
              name="order_phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.order_phone_number}
                  helperText={errors.order_phone_number?.message}
                />
              )}
            />

            <Controller
              name="order_address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!errors.order_address}
                  helperText={errors.order_address?.message}
                />
              )}
            />

            <Controller
              name="order_role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.order_role}>
                  <InputLabel sx={{ background: 'white !important', padding: '0 8px !important' }}>Phân quyền</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const role = roleList?.find((item) => item.roleId === value);
                          return <Chip key={value} label={role?.roleName || value} />;
                        })}
                      </Box>
                    )}
                  >
                    {roleList?.length ? (
                      roleList.map((role) => (
                        <MenuItem key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Không có phân quyền nào</MenuItem>
                    )}
                  </Select>
                  {errors.order_role && <p style={{ color: 'red' }}>{errors.order_role.message}</p>}
                </FormControl>
              )}
            />

            <Controller
              name="order_avatar"
              control={control}
              render={({ field }) => (
                <>
                  <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                    Tải ảnh đại diện
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        field.onChange(file);
                        setPreviewUrl(file ? URL.createObjectURL(file) : '');
                      }}
                    />
                  </Button>
                  {errors.order_avatar && <p style={{ color: 'red' }}>{errors.order_avatar.message}</p>}
                </>
              )}
            />

            {previewUrl && (
              <>
                <p>Xem trước ảnh:</p> <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', height: 'auto' }} />
              </>
            )}
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

export default ModalAddNewOrder;
