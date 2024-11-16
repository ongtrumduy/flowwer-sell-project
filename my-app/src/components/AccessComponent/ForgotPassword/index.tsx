import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import AxiosConfigService from '@services/axios';
import { ACCESS_API } from '@services/constant';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Xử lý gửi yêu cầu quên mật khẩu (Call API)
    console.log('Submitted email:', email);
    // alert('Nếu email tồn tại, hệ thống sẽ gửi liên kết đặt lại mật khẩu.');

    AxiosConfigService.postData({
      url: ACCESS_API.VERIFY_EMAIL(),
      data: {
        emailTo: email,
      },
    })
      .then((data) => {
        console.log('27 data =================>', data);
      })
      .catch((error) => {
        console.log('30 error =================>', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          padding: 4,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Quên Mật Khẩu
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ marginBottom: 3 }}
        >
          Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Gửi yêu cầu
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
