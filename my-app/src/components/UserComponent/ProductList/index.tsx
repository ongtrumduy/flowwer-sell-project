import NoData from '@components/CommonComponent/NoData';
import PaginationProductList from '@components/UserComponent/PaginationProductList';
import SearchProductForm from '@components/UserComponent/SearchProductForm';
import { Container, Grid2 } from '@mui/material';
import CategoryApiService from '@services/api/category';
import {
  InterfaceCategoryItem,
  InterfaceCategoryMetaData,
} from '@services/api/category/type';
import ProductApiService from '@services/api/product';
import {
  InterfaceProductItem,
  InterfaceProductMetaData,
} from '@services/api/product/type';
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_LIMIT,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
} from '@utils/constant';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ProductItem from './ProductItem';
import { AppRoutes } from '@helpers/app.router';

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
    navigate(`${AppRoutes.BASE()}/${AppRoutes.PRODUCT_DETAIL({ productId })}`);
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
      return {
        ...searchParams,
        searchName,
        selectedCategory,
        priceRange,
        isPendingCall: true,
      };
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
        setTotalSearchCount(
          productList.products[0].overview[0].totalSearchCount
        );

        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      })
      .catch(() => {
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
        toast.error(
          error.message ||
            error.message.message ||
            'Get category list error !!!',
          { type: 'error' }
        );
      });
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ maxWidth: '1200px !important' }}>
        <SearchProductForm
          categoryList={categoryList}
          onSearch={handleSearchProduct}
        />

        {productList.length === 0 ? (
          <NoData />
        ) : (
          <>
            <Grid2 container spacing={4} sx={{ padding: 2 }}>
              {productList.map((product: InterfaceProductItem, index) => (
                <ProductItem
                  key={index}
                  product={product}
                  index={index}
                  handleShowProductDetail={handleShowProductDetail}
                />
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
