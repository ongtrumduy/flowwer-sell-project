import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';

const UserProfile = () => {
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Phường XYZ, TP.HCM',
    avatarUrl: 'https://via.placeholder.com/150',
    orders: [
      { id: 1, date: '2024-10-10', total: '500,000 VND' },
      { id: 2, date: '2024-09-20', total: '350,000 VND' },
      { id: 3, date: '2024-08-15', total: '700,000 VND' },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Grid container spacing={4}>
        {/* Thông tin người dùng */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    alt={user.name}
                    src={user.avatarUrl}
                    sx={{ width: 120, height: 120 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{user.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.phone}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.address}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lịch sử đơn hàng */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lịch sử đơn hàng
              </Typography>
              {user.orders.map((order) => (
                <Card key={order.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography variant="body1">
                          Đơn hàng {order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ngày: {order.date}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" color="primary">
                          {order.total}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
