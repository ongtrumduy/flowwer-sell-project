import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: 3,
        padding: 4,
        maxWidth: '1200px !important',
        marginTop: 4,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="h1"
          sx={{ fontSize: '5rem', fontWeight: 'bold', color: '#ff7043' }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ color: '#6c757d', marginBottom: 2 }}>
          Oops! Trang mà bạn đang tìm kiếm không tồn tại
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoBack}
          sx={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Quay trở về Trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
