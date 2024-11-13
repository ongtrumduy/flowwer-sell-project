import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function NoData() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="360px"
      color="text.secondary"
      sx={{ p: 3, textAlign: 'center' }}
    >
      <InsertDriveFileOutlinedIcon fontSize="large" color="disabled" sx={{ fontSize: 80 }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Không có dữ liệu hiển thị
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Hãy thử thay đổi bộ lọc tìm kiếm hoặc tải lại trang.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => window.location.reload()}>
        Tải lại
      </Button>
    </Box>
  );
}

export default NoData;
