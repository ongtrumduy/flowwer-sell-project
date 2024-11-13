import { Box, Button, Container, TextField, Typography } from '@mui/material';
import AccessApiService from '@services/api/access';
import { InterfaceAuthInformationMetaData } from '@services/api/access/type';
import { EnumRole } from '@utils/type';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

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
        if (returnLogin.user.roles.includes(EnumRole.ADMIN)) {
          navigate('/admin');
          return;
        } else if (returnLogin.user.roles.includes(EnumRole.SHIPPER)) {
          navigate('/shipper');
          return;
        } else if (returnLogin.user.roles.includes(EnumRole.EMPLOYEE)) {
          navigate('/employee');
          return;
        }

        navigate('/home');
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
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Đăng nhập
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Bạn chưa có tài khoản?{' '}
            <Link to="/sign-up" color="primary">
              <span style={{ textDecoration: 'underline' }}>Đăng ký ngay</span>
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
