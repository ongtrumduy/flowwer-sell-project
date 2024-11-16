import { AppRoutes } from '@helpers/app.router';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Completion() {
  const navigate = useNavigate();

  const handleBackCategory = () => {
    navigate(`${AppRoutes.BASE()}${AppRoutes.CART()}`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        Bạn đã thanh toán thành công 🎉
      </Typography>
      <Typography variant="h6" gutterBottom>
        Đơn hàng sẽ được vận chuyển và giao đến bạn trong thời gian sớm nhất !!!
      </Typography>
      <Button onClick={handleBackCategory} color="primary" variant="contained">
        Mua sắm tiếp trong giỏ hàng
      </Button>
    </Container>
  );
}

export default Completion;
