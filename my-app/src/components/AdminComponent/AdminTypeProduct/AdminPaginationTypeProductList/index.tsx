import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

const AdminPaginationTypeProductList = ({
  totalPages,
  onPageChange,
}: {
  totalPages: number;
  onPageChange: ({ page }: { page: number }) => void;
}) => {
  const [page, setPage] = useState(1);

  const handleChange = (_event: unknown, value: number) => {
    setPage(value);
    if (onPageChange) {
      onPageChange({ page: value });
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Pagination
        count={totalPages} // Tổng số trang
        page={page} // Trang hiện tại
        onChange={handleChange} // Hàm xử lý khi thay đổi trang
        color="primary" // Tùy chọn màu sắc: primary, secondary
        variant="outlined" // Hoặc "text" cho phong cách khác
        shape="rounded" // Dạng hình phân trang, có thể là "rounded", "circular"
      />
    </Stack>
  );
};

export default AdminPaginationTypeProductList;
