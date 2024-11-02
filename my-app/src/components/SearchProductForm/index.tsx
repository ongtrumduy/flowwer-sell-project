import { Box, Button, FormControl, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material';
import { InterfaceCategoryItem } from '@services/api/category/type';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@utils/constant';
import { useState } from 'react';

const SearchProductForm = ({
  categoryList,
  onSearch,
}: {
  categoryList: InterfaceCategoryItem[];
  onSearch: ({
    searchName,
    selectedCategory,
    priceRange,
  }: {
    searchName: string;
    selectedCategory: string;
    priceRange: number[];
  }) => void;
}) => {
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);

  const handleSearch = () => {
    onSearch({ searchName, selectedCategory, priceRange });
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
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
        sx={{ maxWidth: '320px' }}
      />

      {/* Danh mục sản phẩm */}
      <FormControl fullWidth sx={{ maxWidth: '320px' }}>
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e: { target: { value: string } }) => setSelectedCategory(e.target.value)}
          label="Category"
        >
          {categoryList.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Khoảng giá */}
      <Box sx={{ marginTop: 1, flex: 1 }}>
        <InputLabel>Khoảng giá (VNĐ)</InputLabel>
        <Slider
          value={priceRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={DEFAULT_MIN_PRICE}
          max={DEFAULT_MAX_PRICE}
        />
      </Box>

      {/* Nút tìm kiếm */}
      <Button variant="contained" color="primary" onClick={handleSearch} sx={{ maxWidth: '200px' }}>
        Tìm kiếm
      </Button>
    </Box>
  );
};

export default SearchProductForm;
