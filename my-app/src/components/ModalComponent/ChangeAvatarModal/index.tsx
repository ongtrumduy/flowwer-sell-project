import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const ChangeAvatarModal = ({
  openChangeAvatarDialog,
  handleCloseChangeAvatarDialog,
}: {
  openChangeAvatarDialog: boolean;
  handleCloseChangeAvatarDialog: () => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Xử lý khi người dùng click nút "Upload"
  const handleUploadNewAvatar = async () => {
    if (!selectedFile) return; // Nếu chưa chọn file thì không làm gì

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    setLoading(true); // Bật trạng thái loading

    try {
      const response = await axios.post('/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Nếu upload thành công, lưu URL avatar
      setAvatarUrl(response.data.avatarUrl);
      setError(null);
    } catch (error) {
      // Xử lý lỗi
      setError((error as Error).message || 'Error uploading avatar');
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <Dialog
      open={openChangeAvatarDialog}
      onClose={handleCloseChangeAvatarDialog}
    >
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <div>
          <Typography variant="h6">Upload Avatar</Typography>

          {/* Input file HTML thông thường */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="avatar-upload"
          />

          <label htmlFor="avatar-upload">
            <Button
              variant="contained"
              component="span"
              sx={{ marginRight: 2 }}
            >
              Chọn ảnh
            </Button>
          </label>

          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              File đã chọn: {selectedFile.name}
            </Typography>
          )}

          {error && <Typography color="error">{error}</Typography>}

          {avatarUrl && (
            <div>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Avatar đã upload:
              </Typography>
              <img src={avatarUrl} alt="Avatar" width="100" height="100" />
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseChangeAvatarDialog}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUploadNewAvatar}
          disabled={loading || !selectedFile}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Thay đổi'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeAvatarModal;
