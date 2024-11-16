import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
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
  const { userInformation } = useGetAuthInformationMetaData();

  const handleChangeInformation = () => {};

  const handleChangePassword = () => {};

  const handleChangeAvatar = () => {};

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Grid container spacing={4}>
        {/* Thông tin người dùng */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={12}
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Grid item justifySelf={'center'} alignSelf={'center'}>
                  {userInformation?.avatar_url ? (
                    <Avatar
                      sx={{ width: 200, height: 200 }}
                      src={userInformation?.avatar_url}
                    ></Avatar>
                  ) : (
                    <Avatar sx={{ width: 200, height: 200 }}>
                      {userInformation?.name[0]}
                    </Avatar>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    Họ tên: {userInformation.name}
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    Email: {userInformation.email}
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    Số điện thoại: {userInformation.phone_number}
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    Địa chỉ: {userInformation.address}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 4, marginRight: 4 }}
                    onClick={handleChangeInformation}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 4, marginRight: 4 }}
                    onClick={handleChangePassword}
                  >
                    Đổi mật khẩu
                  </Button>
                  {/* // ========================================== */}

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 4, marginRight: 4 }}
                    onClick={handleChangeAvatar}
                  >
                    Đổi Avatar
                  </Button>
                  {/* // ========================================== */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
