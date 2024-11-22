import { AppRoutes } from '@helpers/app.router';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import AccessApiService from '@services/api/access';
import { InterfaceAuthInformationMetaData } from '@services/api/access/type';
import { EnumRole } from '@utils/type';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Xử lý đăng nhập, ví dụ như gọi API
    // console.log('Đăng nhập:', formData);

    try {
      const returnLogin = (await AccessApiService.login({
        email: formData.email,
        password: formData.password,
      })) as InterfaceAuthInformationMetaData;

      if (returnLogin) {
        if (returnLogin.user.role_list.includes(EnumRole.ADMIN)) {
          navigate(`${AppRoutes.ADMIN_BASE()}`);
          return;
        } else if (returnLogin.user.role_list.includes(EnumRole.SHIPPER)) {
          navigate(`${AppRoutes.SHIPPER_BASE()}`);
          return;
        } else if (returnLogin.user.role_list.includes(EnumRole.EMPLOYEE)) {
          navigate(`${AppRoutes.EMPLOYEE_BASE()}`);
          return;
        }

        navigate(`${AppRoutes.BASE()}`);
      }

      return returnLogin;
    } catch (error) {
      console.log(error);

      return error;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
      <Box
        sx={{
          width: 400,
          margin: 'auto',
          padding: 4,
          marginTop: 16,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Đăng nhập
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" variant="outlined" fullWidth margin="normal" name="email" value={formData.email} onChange={handleChange} required />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Đăng nhập
          </Button>

          {/* Thêm quên mật khẩu */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link to={`${AppRoutes.BASE()}${AppRoutes.FORGOT_PASSWORD()}`} color="primary">
              <span style={{ textDecoration: 'underline' }}>Quên mật khẩu?</span>
            </Link>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Bạn chưa có tài khoản?{' '}
            <Link to={`${AppRoutes.BASE()}${AppRoutes.SIGN_UP()}`} color="primary">
              <span style={{ textDecoration: 'underline' }}>Đăng ký ngay</span>
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
