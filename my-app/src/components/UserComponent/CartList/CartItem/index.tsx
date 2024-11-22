import { Add, Delete, Remove } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid2,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { InterfaceCartProductReturnItem } from '@services/api/cart/type';

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onSelect,
}: {
  item: InterfaceCartProductReturnItem;
  onIncrease: ({ cartProductId }: { cartProductId: string }) => void;
  onDecrease: ({ cartProductId }: { cartProductId: string }) => void;
  onRemove: ({ cartProductId }: { cartProductId: string }) => void;
  onSelect: ({ cartProductId }: { cartProductId: string }) => void;
}) => (
  <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
    <Grid2 size={1}>
      <FormControlLabel
        control={
          <Checkbox
            checked={item.selected}
            onChange={() => onSelect({ cartProductId: item._id })}
          />
        }
        label=""
      />
    </Grid2>
    <Grid2 container spacing={2} alignItems="center">
      <Grid2 size={2}>
        <img
          src={item.productId.product_image}
          alt={item.productId.product_name}
          style={{ width: '100px', height: '100px' }}
        />
      </Grid2>
      <Grid2 size={4}>
        <Typography variant="h6">{item.productId.product_name}</Typography>
        <Typography color="text.secondary">
          {item.productId.product_description}
        </Typography>
      </Grid2>
      <Grid2 size={2}>
        <Typography variant="subtitle1" color="primary">
          {item.productId.product_price} VNĐ
        </Typography>
      </Grid2>
      <Grid2 size={3}>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={() => onDecrease({ cartProductId: item._id })}
            size="small"
          >
            <Remove />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 1 }}>
            {item.product_quantity}
          </Typography>
          <IconButton
            onClick={() => onIncrease({ cartProductId: item._id })}
            size="small"
          >
            <Add />
          </IconButton>
        </Box>
      </Grid2>
      <Grid2 size={1}>
        <IconButton
          onClick={() => onRemove({ cartProductId: item._id })}
          color="error"
        >
          <Delete />
        </IconButton>
      </Grid2>
    </Grid2>
  </Paper>
);

export default CartItem;
