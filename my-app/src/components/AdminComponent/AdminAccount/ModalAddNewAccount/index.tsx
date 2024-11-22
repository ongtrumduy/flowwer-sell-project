import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import AccountApiService from '@services/api/account';
import { InterfaceAccountMetaData } from '@services/api/account/type';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InterfaceSubmitFormAddState } from '../type';
import accountAddNewSchema from './yup';

const ModalAddNewAccount = ({
  openAddNewPopup,
  setOpenAddNewPopup,
  handleDialogClose,
  roleList,
}: {
  openAddNewPopup: boolean;
  setOpenAddNewPopup: React.Dispatch<React.SetStateAction<boolean>>;
  handleDialogClose: () => void;
  roleList: { roleId: string; roleName: string }[] | undefined;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account_name: '',
      account_email: '',
      account_phone_number: '',
      account_avatar: '',
      account_address: '',
      account_role: [],
    },
    resolver: yupResolver(accountAddNewSchema),
  });

  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleAddAccount = (data: InterfaceSubmitFormAddState) => {
    // Tạo FormData
    const formData = new FormData();
    formData.append('account_name', data.account_name);
    formData.append('account_email', String(data.account_email));
    formData.append('account_phone_number', String(data.account_phone_number));
    formData.append('account_address', String(data.account_address));

    if (data.account_role && data.account_role.length) {
      data.account_role.forEach((role: Blob) => {
        formData.append('account_role[]', role);
      });
    }

    try {
      // Gửi dữ liệu đến API
      AccountApiService.createNewAccount({
        formData,
      })
        .then((data) => {
          const responseData = data as InterfaceAccountMetaData;

          console.log('responseData ====================>', responseData);

          // handleGetAccountList();
        })
        .then(() => {
          navigate(0);
          setOpenAddNewPopup(false);

          reset();
        });
    } catch (error) {
      console.error('Error while adding account:', error);
    }
  };

  return (
    <>
      <Dialog open={openAddNewPopup} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm mới Tài khoản</DialogTitle>
        <form onSubmit={handleSubmit(handleAddAccount)}>
          <DialogContent>
            <Controller
              name="account_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên tài khoản"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.account_name}
                  helperText={errors.account_name?.message}
                />
              )}
            />

            <Controller
              name="account_email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.account_email}
                  helperText={errors.account_email?.message}
                />
              )}
            />

            <Controller
              name="account_phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.account_phone_number}
                  helperText={errors.account_phone_number?.message}
                />
              )}
            />

            <Controller
              name="account_address"
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
                  error={!!errors.account_address}
                  helperText={errors.account_address?.message}
                />
              )}
            />

            <Controller
              name="account_role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.account_role}>
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
                  {errors.account_role && <p style={{ color: 'red' }}>{errors.account_role.message}</p>}
                </FormControl>
              )}
            />

            <Controller
              name="account_avatar"
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
                  {errors.account_avatar && <p style={{ color: 'red' }}>{errors.account_avatar.message}</p>}
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

export default ModalAddNewAccount;
