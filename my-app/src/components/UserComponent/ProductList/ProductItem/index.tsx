import {
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Paper,
  Typography,
} from '@mui/material';
import { InterfaceProductItem } from '@services/api/product/type';

const ProductItem = ({
  product,
  index,
  handleShowProductDetail,
}: {
  product: InterfaceProductItem;
  index: number;
  handleShowProductDetail: ({ productId }: { productId: string }) => void;
}) => {
  return (
    <Grid2
      size={{ xs: 12, sm: 6, md: 3 }}
      key={product.productId || index}
      sx={{ marginBottom: 4 }}
    >
      <Paper>
        <Card
          sx={{ maxWidth: 250, margin: 'auto', cursor: 'pointer' }}
          onClick={() =>
            handleShowProductDetail({
              productId: String(product.productId),
            })
          }
        >
          <CardMedia
            component="img"
            height="150"
            image={product.product_image}
            alt={product.product_name}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {product.product_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.product_price}
            </Typography>
          </CardContent>
          {/* <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" color="primary">
              Mua ngay
            </Button>
            <Button size="small" color="secondary">
              <Tooltip title="Thêm vào giỏ hàng">
                <Additem size="32" color="#FF8A65" />
              </Tooltip>
            </Button>
          </CardActions> */}
        </Card>
      </Paper>
    </Grid2>
  );
};

export default ProductItem;
