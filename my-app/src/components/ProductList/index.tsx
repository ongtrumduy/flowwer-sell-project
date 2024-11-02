import NoData from '@components/NoData';
import PaginationProductList from '@components/PaginationProductList';
import SearchProductForm from '@components/SearchProductForm';
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
import CategoryApiService from '@services/api/category';
import { InterfaceCategoryItem, InterfaceCategoryMetaData } from '@services/api/category/type';
import ProductApiService from '@services/api/product';
import { InterfaceProductItem, InterfaceProductMetaData } from '@services/api/product/type';
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_LIMIT,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
} from '@utils/constant';
import { Additem } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

function ProductList() {
  const navigate = useNavigate();

  const [productList, setProductList] = useState<InterfaceProductItem[]>([]);
  const [categoryList, setCategoryList] = useState<InterfaceCategoryItem[]>([
    {
      category_name: 'Tất cả',
      categoryId: DEFAULT_CATEGORY_ID,
      category_description: 'Tất cả',
    },
  ]);
  const [totalSearchCount, setTotalSearchCount] = useState(0);

  const [searchParams, setSearchParams] = useState({
    searchName: '',
    selectedCategory: '',
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });

  const handleShowProductDetail = ({ productId }: { productId: string }) => {
    navigate(`/product-detail/${productId}`);
  };

  const handleSearchProduct = ({
    searchName,
    selectedCategory,
    priceRange,
  }: {
    searchName: string;
    selectedCategory: string;
    priceRange: number[];
  }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, searchName, selectedCategory, priceRange, isPendingCall: true };
    });
  };

  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  useEffect(() => {
    ProductApiService.getAllProductList(searchParams)
      .then((data) => {
        const productList = data as InterfaceProductMetaData;

        setProductList(productList.products[0].data);
        setTotalSearchCount(productList.products[0].overview[0].totalSearchCount);

        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      })
      .catch((error) => {
        toast.error(error.message || error.message.message || 'Get product list error !!!', { type: 'error' });

        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  useEffect(() => {
    CategoryApiService.getAllCategoryList()
      .then((data) => {
        const categoryList = data as InterfaceCategoryMetaData;

        setCategoryList((prev) => {
          return [...prev, ...categoryList.categories[0].data];
        });
      })
      .catch((error) => {
        toast.error(error.message || error.message.message || 'Get category list error !!!', { type: 'error' });
      });
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
        <SearchProductForm categoryList={categoryList} onSearch={handleSearchProduct} />

        {productList.length === 0 ? (
          <NoData />
        ) : (
          <>
            <Grid2 container spacing={4} sx={{ padding: 2 }}>
              {productList.map((product: InterfaceProductItem, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={product.productId || index} sx={{ marginBottom: 4 }}>
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
                      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

            <PaginationProductList
              totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Container>
    </React.Fragment>
  );
}

export default ProductList;
