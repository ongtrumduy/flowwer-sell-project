import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  Paper,
  Typography,
} from '@mui/material';
import CartApiService from '@services/api/cart';
import {
  InterfaceCartProductMetaData,
  InterfaceCartProductReturnItem,
} from '@services/api/cart/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import { useEffect, useMemo, useState } from 'react';
import CartItem from './CartItem';
import PaginationCartProductList from '../PaginationCartProductList';
import OrderApiService from '@services/api/order';
import useGetAuthInformationMetaData from '@hooks/useGetAuthInformationMetaData';
import { AppRoutes } from '@helpers/app.router';
import { useNavigate } from 'react-router';

const CartList = () => {
  const [cartProductList, setCartProductList] = useState<
    InterfaceCartProductReturnItem[]
  >([]);

  const [searchParams, setSearchParams] = useState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);
  const [isPendingQuantity, setIsPendingQuantity] = useState(false);

  const { userInformation } = useGetAuthInformationMetaData();

  const navigate = useNavigate();

  const delivery_address = useMemo(() => {
    return userInformation.address;
  }, [userInformation.address]);

  const total = useMemo(() => {
    return cartProductList.reduce(
      (acc, item) =>
        acc +
        (item.selected ? item.product_price_now * item.product_quantity : 0),
      0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(cartProductList)]);

  const handleIncrease = ({ cartProductId }: { cartProductId: string }) => {
    if (!isPendingQuantity) {
      setIsPendingQuantity(true);

      const product = cartProductList.find((p) => {
        return p._id === cartProductId;
      });

      CartApiService.updateQuantityProductInCartV2({
        cartProductId,
        product_quantity: product ? product?.product_quantity + 1 : 0,
      })
        .then((data) => {
          const returnChangeQuantity = data;

          if (returnChangeQuantity) {
            setCartProductList((prevItems) =>
              prevItems.map((item) =>
                item._id === cartProductId
                  ? { ...item, product_quantity: item.product_quantity + 1 }
                  : item
              )
            );
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsPendingQuantity(false);
        });
    }
  };

  const handleDecrease = ({ cartProductId }: { cartProductId: string }) => {
    if (!isPendingQuantity) {
      setIsPendingQuantity(true);

      const product = cartProductList.find((p) => {
        return p._id === cartProductId;
      });

      CartApiService.updateQuantityProductInCartV2({
        cartProductId,
        product_quantity:
          product && product?.product_quantity > 1
            ? product?.product_quantity - 1
            : (product?.product_quantity ?? 0),
      })
        .then((data) => {
          const returnChangeQuantity = data;

          if (returnChangeQuantity) {
            setCartProductList((prevItems) =>
              prevItems.map((item) =>
                item._id === cartProductId && item.product_quantity > 1
                  ? { ...item, product_quantity: item.product_quantity - 1 }
                  : item
              )
            );
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsPendingQuantity(false);
        });
    }
  };

  const handleRemove = ({ cartProductId }: { cartProductId: string }) => {
    if (!isPendingQuantity) {
      setIsPendingQuantity(true);

      CartApiService.deleteProductInCartItems({ cartProductId })
        .then((data) => {
          const returnRemove = data;

          if (returnRemove) {
            setCartProductList((prevItems) =>
              prevItems.filter((item) => item._id !== cartProductId)
            );
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsPendingQuantity(false);
        });
    }
  };

  const handleSelect = ({ cartProductId }: { cartProductId: string }) => {
    setCartProductList((prevItems) =>
      prevItems.map((item) =>
        item._id === cartProductId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handlePageChange = ({ page }: { page: number }) => {
    setSearchParams((searchParams) => {
      return { ...searchParams, page };
    });
  };

  const handlePaymentClick = () => {
    if (!isPendingQuantity) {
      setIsPendingQuantity(true);

      OrderApiService.createOrderForCustomer({
        order_item_list: cartProductList
          .filter((item) => {
            return item.selected;
          })
          .map((item) => {
            return {
              productId: item._id,
              product_quantity: item.product_quantity,
              product_price_now: item.product_price_now,
            };
          }),
        delivery_address: delivery_address,
        total_amount: total,
      })
        .then((data) => {
          const returnOrder = data;

          if (returnOrder) {
            console.log('returnOrder ================>', { returnOrder });
            // Redirect to payment page
            navigate(`${AppRoutes.BASE()}/${AppRoutes.PAYMENT()}`);
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsPendingQuantity(false);
        });
    }
  };

  useEffect(() => {
    CartApiService.getAllCartProductList(searchParams)
      .then((data) => {
        const returnCartProductList = data as InterfaceCartProductMetaData;

        setCartProductList(
          returnCartProductList.carts.data.cart_pagination_item_list.map(
            (item) => {
              return { ...item, selected: false };
            }
          )
        );

        setTotalSearchCount(
          returnCartProductList.carts.overview.totalSearchCount
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

  return (
    <Container maxWidth="lg" sx={{ maxWidth: '1200px !important', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng của bạn
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid2 container spacing={4}>
        <Grid2 size={8}>
          {cartProductList.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onSelect={handleSelect}
            />
          ))}
          <PaginationCartProductList
            totalPages={Math.ceil(totalSearchCount / DEFAULT_LIMIT)}
            onPageChange={handlePageChange}
          />
        </Grid2>

        <Grid2 size={4}>
          <Paper sx={{ padding: 2 }}>
            <Divider sx={{ my: 2 }} />

            <Box
              display="flex"
              flexDirection={'column'}
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography variant="h6" sx={{ mr: 4, mb: 4 }}>
                Tổng cộng: {total} VNĐ
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={total <= 0}
                onClick={handlePaymentClick}
              >
                Thanh toán
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default CartList;
