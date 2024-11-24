import { AppRoutes } from '@helpers/app.router';
import {
  Button,
  Card,
  CardMedia,
  Container,
  Grid2,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import CartApiService from '@services/api/cart';
import ProductApiService from '@services/api/product';
import {
  InterfaceProductDetailItemMetaData,
  InterfaceProductItem,
} from '@services/api/product/type';
import { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ReviewList from '../ReviewList';

const ProductDetail = () => {
  const { productId } = useParams();

  const [productDetail, setProductDetail] = useState<InterfaceProductItem>({
    product_name: '',
    product_quantity: 0,
    product_price: 0,
    product_image: '',
    product_description: '',
    productId: '',
    product_category: [],
    product_average_rating: 0,
    product_total_review: 0,
  });

  const [quantity, setQuantity] = useState(1); // Khởi tạo state cho số lượng sản phẩm

  const navigate = useNavigate();

  const availableStock = useMemo(() => {
    return productDetail.product_quantity;
  }, [productDetail.product_quantity]);

  // Hàm xử lý khi người dùng thay đổi số lượng sản phẩm
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantityTemp = parseInt(event.target.value, 10);

    const checkNumber1 = isNaN(quantityTemp);
    const checkNumber2 = isNaN(Number(event.target.value));

    if (checkNumber1 || checkNumber2 || quantityTemp < 1) {
      setQuantity(1);

      return;
    }

    console.log('Thêm vào Giỏ hàng', {
      quantityTemp,
      checkNumber1,
      checkNumber2,
    });

    const value = Math.max(1, quantityTemp); // Đảm bảo số lượng tối thiểu là 1
    setQuantity(value);
  };

  // Hàm xử lý khi bấm vào "Thêm vào Giỏ hàng"
  const handleAddToCart = () => {
    // Thực hiện logic thêm vào giỏ hàng, ví dụ như gọi API hoặc cập nhật state giỏ hàng
    console.log(
      `Thêm vào Giỏ hàng: ${productDetail.product_name}, Số lượng: ${quantity}`
    );

    if (productDetail.productId && productDetail.product_quantity) {
      CartApiService.addProductToCart({
        productId: productDetail.productId,
        product_quantity: quantity,
      })
        .then((data) => {
          console.log('response data from =================', { data });
        })
        .catch(() => {});
    }
  };

  // Hàm xử lý khi bấm vào "Mua ngay"
  // const handleBuyNow = () => {
  //   // Thực hiện logic mua ngay, ví dụ như điều hướng tới trang thanh toán
  //   console.log(
  //     `Mua ngay: ${productDetail.product_name}, Số lượng: ${quantity}`
  //   );
  // };

  useEffect(() => {
    if (productId) {
      ProductApiService.getProductItemDetail({ productId })
        .then((data) => {
          const productDetail = data as InterfaceProductDetailItemMetaData;

          setProductDetail(productDetail.productDetail);
        })
        .catch((error) => {
          console.error('show error message ===>', { error });

          navigate(`${AppRoutes.BASE()}${AppRoutes.UNAUTHORIZED()}`);
        });
    }
  }, [productId]);

  if (!productId) {
    return <Navigate to={`${AppRoutes.BASE()}${AppRoutes.UNAUTHORIZED()}`} />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ maxWidth: '1200px !important', marginTop: 4 }}
    >
      <Grid2 container spacing={4}>
        {/* Hình ảnh sản phẩm */}
        <Grid2 sx={{ xs: 12, md: 6 }}>
          <Card>
            <CardMedia
              component="img"
              image={productDetail.product_image || ''}
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
        <Grid2 sx={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom>
            {productDetail.product_name}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            <NumericFormat
              value={Number(productDetail.product_price || 0)}
              thousandSeparator={'.'}
              decimalSeparator={','}
              displayType={'text'}
              suffix={' VNĐ'}
              className="money"
            />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {productDetail.product_description}
          </Typography>

          {/* Hiển thị số lượng còn lại */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginTop: 2, fontWeight: 'bold' }}
          >
            Số lượng còn lại: {availableStock}
          </Typography>

          <Rating
            value={Number(productDetail.product_average_rating || 0)}
            sx={{ marginTop: 2 }}
            readOnly
          />
          <Typography variant="body1" color="text.secondary">
            Tổng số đánh giá: {productDetail.product_total_review || 0}
          </Typography>

          {/* Bộ chọn số lượng sản phẩm */}
          <Grid2
            container
            alignItems="center"
            spacing={1}
            sx={{ marginTop: 2 }}
          >
            <Typography variant="subtitle1">Số lượng:</Typography>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              InputProps={{ inputProps: { min: 1, max: availableStock } }}
              sx={{ width: '80px', marginLeft: 1 }}
              onChange={handleQuantityChange}
              value={quantity}
            />
          </Grid2>

          <Grid2 container spacing={2} sx={{ marginTop: 2 }}>
            <Grid2>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={quantity > availableStock}
              >
                Thêm vào Giỏ hàng
              </Button>
            </Grid2>
            {/* <Grid2>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleBuyNow}
                disabled={quantity > availableStock}
              >
                Mua ngay
              </Button>
            </Grid2> */}
          </Grid2>
        </Grid2>
      </Grid2>

      {/* // ================================================================= */}
      <ReviewList productId={productId || ''} />
    </Container>
  );
};

export default ProductDetail;
