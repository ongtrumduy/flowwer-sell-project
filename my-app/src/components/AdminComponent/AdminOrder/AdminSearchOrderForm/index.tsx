import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { EnumOrderStatusStage } from '@services/api/stripe_payment/type';
import { useState } from 'react';

const AdminSearchOrderForm = ({ onSearch }: { onSearch: ({ searchName, orderStatus }: { searchName: string; orderStatus: EnumOrderStatusStage }) => void }) => {
  const [searchName, setSearchName] = useState('');
  const [orderStatus, setOrderStatus] = useState<EnumOrderStatusStage>(EnumOrderStatusStage.PENDING);

  const handleSearch = () => {
    onSearch({ searchName, orderStatus });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        margin: 'auto',
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {/* Tên sản phẩm */}
      <TextField
        label="Tên sản phẩm"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ maxWidth: '400px' }}
      />

      {/* Danh mục sản phẩm */}
      <FormControl fullWidth sx={{ maxWidth: '400px' }}>
        <InputLabel>Danh mục</InputLabel>
        <Select value={orderStatus} onChange={(e: { target: { value: string } }) => setOrderStatus(e.target.value as EnumOrderStatusStage)} label="Category">
          {Object.values(EnumOrderStatusStage).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Nút tìm kiếm */}
      <Button variant="contained" color="primary" onClick={handleSearch} sx={{ maxWidth: '200px' }}>
        Tìm kiếm
      </Button>
    </Box>
  );
};

export default AdminSearchOrderForm;
