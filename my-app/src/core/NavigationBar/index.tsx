import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

import AccountMenu from '@components/CommonComponent/AccountMenu';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import { DocumentSketch, Home, LoginCurve, ShoppingCart } from 'iconsax-react';
import flower_shop_logo from '../../assets/images/flower.png';

import { AppRoutes } from '@helpers/app.router';
import { useNavigate } from 'react-router-dom';
import styles from './NavigationBar.module.scss';

function NavigationBar() {
  const navigate = useNavigate();

  const { isAuthenticated } = useGetAuthInformationMetaData();

  return (
    <AppBar
      position="static"
      sx={{
        alignItems: 'center',
        background: 'white',
        height: '80px',
        fontSize: '20px',
      }}
      className={styles.navigation_bar_custom}
    >
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
            <img
              src={flower_shop_logo}
              alt=""
              style={{ width: '48px', height: '48px', marginRight: '8px' }}
            />
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
            <Button
              color="inherit"
              onClick={() => navigate(`${AppRoutes.BASE()}`)}
            >
              <Home size="32" color="#FF8A65" />
              <span>Trang chủ</span>
            </Button>
            <Button
              color="inherit"
              onClick={() =>
                navigate(`${AppRoutes.BASE()}${AppRoutes.ORDER()}`)
              }
            >
              {/* <Call size="32" color="#FF8A65" /> */}
              <DocumentSketch size="32" color="#FF8A65" />
              <span> Đơn hàng</span>
            </Button>
            {/* <Button
              color="inherit"
              onClick={() =>
                navigate(`${AppRoutes.BASE()}/${AppRoutes.NOTIFY()}`)
              }
            >
              <Notification size="32" color="#FF8A65" />
              <span> Thông báo</span>
            </Button> */}
            <Button
              color="inherit"
              onClick={() => navigate(`${AppRoutes.BASE()}${AppRoutes.CART()}`)}
            >
              <ShoppingCart size="32" color="#FF8A65" />
              <span> Giỏ hàng</span>
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
