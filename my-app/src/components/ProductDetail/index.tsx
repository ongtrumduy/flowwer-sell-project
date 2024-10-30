import {
  Button,
  Card,
  CardMedia,
  Container,
  Grid2,
  Typography,
} from '@mui/material';
import ProductApiService from '@services/api/product';
import {
  InterfaceProductDetailItemMetaData,
  InterfaceProductItem,
} from '@services/api/product/type';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const ProductDetail = () => {
  const { productId } = useParams();

  const [productDetail, setProductDetail] = useState<InterfaceProductItem>({
    product_name: '',
    order_quantity: 0,
    product_price: 0,
    product_image: '',
    product_description: '',
    productId: '',
  });

  useEffect(() => {
    if (productId) {
      ProductApiService.getProductItemDetail({ productId }).then((data) => {
        console.log('ProductApiService ==========>', { data });
        const productDetail = data as InterfaceProductDetailItemMetaData;

        setProductDetail(productDetail.productDetail);
      });
    }
  }, [productId]);

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Grid2 container spacing={4}>
        {/* Hình ảnh sản phẩm */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardMedia
              component="img"
              image={productDetail.product_image}
              alt={productDetail.product_name}
              sx={{
                width: '560px',
                height: '400px',
                minWidth: '560px',
                minHeight: '400px',
              }}
            />
          </Card>
        </Grid2>

        {/* Thông tin chi tiết sản phẩm */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom>
            {productDetail.product_name}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {productDetail.product_price}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {productDetail.product_description}
          </Typography>
          <Grid2 container spacing={2} sx={{ marginTop: 2 }}>
            <Grid2>
              <Button variant="contained" color="primary" size="large">
                Thêm vào Giỏ hàng
              </Button>
            </Grid2>
            <Grid2>
              <Button variant="outlined" color="secondary" size="large">
                Mua ngay
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ProductDetail;
