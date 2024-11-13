import { Box, Button, TextField, Typography } from '@mui/material';
import AccessApiService from '@services/api/access';
import { EnumRole, InterfaceAuthInformationMetaData } from '@utils/type';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });

  const handleChange = (e: { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Xử lý logic đăng ký ở đây
    // console.log('Form submitted:', formData);

    try {
      const returnSignUp = (await AccessApiService.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      })) as InterfaceAuthInformationMetaData;

      if (returnSignUp) {
        if (returnSignUp.user.roles.includes(EnumRole.ADMIN)) {
          navigate('/admin');
          return;
        } else if (returnSignUp.user.roles.includes(EnumRole.SHIPPER)) {
          navigate('/shipper');
          return;
        } else if (returnSignUp.user.roles.includes(EnumRole.EMPLOYEE)) {
          navigate('/employee');
          return;
        }

        navigate('/home');
      }

      return returnSignUp;
    } catch (error) {
      console.log(error);

      return error;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
        margin: 'auto',
        padding: 4,
        marginTop: 16,
        gap: 4,
        boxShadow: 4,
        borderRadius: 4,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Đăng ký
      </Typography>
      <TextField
        label="Tên"
        name="name"
        variant="outlined"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Mật khẩu"
        name="password"
        type="password"
        variant="outlined"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <TextField
        label="Số điện thoại"
        name="phoneNumber"
        type="phoneNumber"
        variant="outlined"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <TextField
        label="Địa chỉ"
        name="address"
        type="address"
        variant="outlined"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary" size="large">
        Đăng ký
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Bạn đã có tài khoản?{' '}
        <Link to="/login" color="primary">
          <span style={{ textDecoration: 'underline' }}>Đăng nhập ngay</span>
        </Link>
      </Typography>
    </Box>
  );
}

export default SignUp;
