import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import ProductApiService from '@services/api/product';
import {
  InterfaceProductItem,
  InterfaceProductMetaData,
} from '@services/api/product/type';
import { Additem } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function ProductList() {
  const [productList, setProductList] = useState<InterfaceProductItem[]>([]);

  const navigate = useNavigate();

  const handleShowProductDetail = ({ productId }: { productId: string }) => {
    navigate(`/product-detail/${productId}`);
  };

  useEffect(() => {
    ProductApiService.getAllProductList({ limit: 100, page: 1 }).then(
      (data) => {
        // console.log('ProductApiService ==========>', { data });
        const productList = data as InterfaceProductMetaData;

        setProductList(productList.products[0].data);
      }
    );
  }, []);

  return (
    <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
      <Grid2 container spacing={4} sx={{ padding: 2 }}>
        {productList.map((product: InterfaceProductItem, index) => (
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
                <CardActions
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button size="small" color="primary">
                    Mua ngay
                  </Button>
                  <Button size="small" color="secondary">
                    <Tooltip title="Thêm vào giỏ hàng">
                      <Additem size="32" color="#FF8A65" />
                    </Tooltip>
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default ProductList;
