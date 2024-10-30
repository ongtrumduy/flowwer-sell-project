import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

import AccountMenu from '@components/AccountMenu';
import { Call, Home, LoginCurve, Notification, ShoppingCart } from 'iconsax-react';
import { useNavigate } from 'react-router';
import flower_shop_logo from '../../assets/images/flower.png';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';

function NavigationBar() {
  const navigate = useNavigate();

  const { isAuthenticated } = useGetAuthInformationMetaData();

  return (
    <AppBar position="static" sx={{ alignItems: 'center', background: 'white', height: '80px' }}>
      <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
        <Toolbar disableGutters sx={{ width: '100%' }}>
          {/* // ----------------------------------------------------------- */}
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: 'rgba(136,38,88, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            <img src={flower_shop_logo} alt="" style={{ width: '48px', height: '48px', marginRight: '8px' }} />
            Hoa xinh SHOP
          </Typography>
          {/* // ----------------------------------------------------------- */}

          {/* // ----------------------------------------------------------- */}
          {/* Menu */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              color: 'rgba(136,38,88, 0.8)',
              marginRight: 4,
            }}
          >
            <Button color="inherit" onClick={() => navigate('/')}>
              <Home size="32" color="#FF8A65" />
              Trang chủ
            </Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>
              <Call size="32" color="#FF8A65" />
              Liên hệ
            </Button>
            <Button color="inherit" onClick={() => navigate('/notification')}>
              <Notification size="32" color="#FF8A65" />
              Thông báo
            </Button>
            <Button color="inherit" onClick={() => navigate('/cart')}>
              <ShoppingCart size="32" color="#FF8A65" /> Giỏ hàng
            </Button>
          </Box>
          {/* // ----------------------------------------------------------- */}

          {/* // ----------------------------------------------------------- */}
          {/* User Avatar */}
          {/* <Avatar
            alt="User Avatar"
            src="https://via.placeholder.com/40"
            sx={{ width: 40, height: 40, marginLeft: 4 }}
          /> */}
          {/* // ----------------------------------------------------------- */}

          {/* // ----------------------------------------------------------- */}
          {/* User Menu */}
          {isAuthenticated ? (
            <AccountMenu />
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                color: 'rgba(136,38,88, 0.8)',
              }}
            >
              <LoginCurve size="32" color="#FF8A65" />
              Đăng nhập
            </Button>
          )}
          {/* // ----------------------------------------------------------- */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavigationBar;
