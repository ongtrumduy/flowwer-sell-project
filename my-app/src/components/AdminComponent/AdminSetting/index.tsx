import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';

// Cấu trúc dữ liệu cho Settings
interface Settings {
  notifications: boolean;
  email: string;
  password: string;
  twoFactorAuth: boolean;
}

const initialSettings: Settings = {
  notifications: true,
  email: 'user@example.com',
  password: '',
  twoFactorAuth: false,
};

const AdminSetting: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: checked,
      }));
    } else {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    // Giả lập lưu thiết lập vào backend
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved!');
    }, 1000);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Cài đặt thông báo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Notifications</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleChange}
                    name="notifications"
                    color="primary"
                  />
                }
                label={settings.notifications ? 'Enabled' : 'Disabled'}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Cài đặt email */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Email</Typography>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                name="email"
                value={settings.email}
                onChange={handleChange}
                disabled={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Cài đặt mật khẩu */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Password</Typography>
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                value={settings.password}
                onChange={handleChange}
                disabled={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Cài đặt xác thực 2 yếu tố */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Two-Factor Authentication</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    name="twoFactorAuth"
                    color="primary"
                  />
                }
                label={settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nút Lưu */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSetting;
