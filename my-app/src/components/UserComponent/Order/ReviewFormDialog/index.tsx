import React, { useEffect } from 'react';
import {
  useForm,
  // Controller,
  useFieldArray,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Rating,
  // TextField,
  // Rating,
  // Typography,
} from '@mui/material';
import { InterfaceOrderItem } from '@services/api/order/type';

// Validation schema
const reviewSchema = yup.object().shape({
  review_product_list: yup.array().of(
    yup.object().shape({
      productId: yup.string().required('productId không được trống'),
      product_name: yup.string().required('product_name không được trống'),
      product_image: yup.string().nullable().notRequired(),
      comment_title: yup
        .string()
        .required('Tiêu đề không được để trống')
        .max(50, 'Tiêu đề không được dài quá 50 ký tự'),
      comment_content: yup
        .string()
        .required('Nội dung không được để trống')
        .max(300, 'Nội dung không được dài quá 300 ký tự'),
      comment_rating: yup
        .number()
        .min(1, 'Bạn cần chọn ít nhất 1 sao')
        .max(5, 'Không được vượt quá 5 sao')
        .required('Vui lòng chọn số sao đánh giá'),
    })
  ),
});

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    review_product_list?:
      | {
          product_image?: yup.Maybe<string | null | undefined>;
          productId: string;
          product_name: string;
          comment_title: string;
          comment_content: string;
          comment_rating: number;
        }[]
      | undefined;
  }) => void;
  selectedId: string;
  orderItemList: InterfaceOrderItem[];
}

const ReviewFormDialog: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  onSubmit,
  orderItemList,
}) => {
  // const defaultValues = {
  //   review_product_list: [
  //     {
  //       productId: {
  //         _id: '6720923341e79a0706bb5e10',
  //         product_name: 'Hoa nhài',
  //         product_price: 25000,
  //         product_image:
  //           'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Arabian_jasmin%2C_Tunisia_2010.jpg/280px-Arabian_jasmin%2C_Tunisia_2010.jpg',
  //         product_description:
  //           'Hoa nhài trắng, mang lại hương thơm dịu dàng và thanh khiết.',
  //         createdAt: '2024-10-29T07:43:47.572Z',
  //         updatedAt: '2024-11-23T14:57:09.690Z',
  //         __v: 0,
  //         product_quantity: 23,
  //       },
  //       product_quantity: 3,
  //       product_price_now: 25000,
  //       _id: '673dc22581c5befaa4f1c1e3',
  //     },
  //   ].map((product) => {
  //     return {
  //       productId: product._id,
  //       product_name: product.productId.product_name,
  //       product_image: product.productId.product_image,
  //       comment_title: '',
  //       comment_content: '',
  //       comment_rating: 5,
  //     };
  //   }),
  // };

  const defaultValues = {
    review_product_list: [],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(reviewSchema),
  });

  const {
    fields,
    append,
    //  remove
  } = useFieldArray({
    control,
    name: 'review_product_list',
  });

  const handleFormSubmit = (data: {
    review_product_list?:
      | {
          product_image?: yup.Maybe<string | null | undefined>;
          productId: string;
          product_name: string;
          comment_title: string;
          comment_content: string;
          comment_rating: number;
        }[]
      | undefined;
  }) => {
    onSubmit(data);

    // onCloseDialog(); // Đóng Dialog trước
    // setTimeout(() => reset(), 0); // Đặt reset sau một khoảng thời gian ngắn
    // reset();
  };

  const onCloseDialog = () => {
    // orderItemList.forEach((item, index) => {
    //   remove(index);
    // });
    onClose();
  };

  useEffect(() => {
    if (orderItemList.length > 0) {
      orderItemList.forEach((orderItem) => {
        append({
          product_image: orderItem?.productId?.product_image || '',
          productId: orderItem?.productId?._id || '',
          product_name: orderItem?.productId?.product_name || '',
          comment_title: '',
          comment_content: '',
          comment_rating: 5,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderItemList)]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Đánh giá sản phẩm</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {fields.map((field, index) => {
            return (
              <div
                key={field.productId}
                style={{
                  marginBottom: '3rem',
                  border: '4px solid #ccc',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <div style={{ gap: '12px', marginRight: '24px' }}>
                    <img
                      src={field.product_image || ''}
                      alt=""
                      style={{ width: '48px', height: '48px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {field.product_name}
                    </span>
                  </div>
                </div>
                <Controller
                  name={`review_product_list.${index}.comment_title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tiêu đề đánh giá"
                      fullWidth
                      error={
                        !!errors.review_product_list?.[index]?.comment_title
                          ?.message
                      }
                      helperText={
                        errors.review_product_list?.[index]?.comment_title
                          ?.message
                      }
                      margin="normal"
                      required
                    />
                  )}
                />

                <Controller
                  name={`review_product_list.${index}.comment_content`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nội dung đánh giá"
                      multiline
                      rows={4}
                      fullWidth
                      error={
                        !!errors.review_product_list?.[index]?.comment_content
                          ?.message
                      }
                      helperText={
                        !!errors.review_product_list?.[index]?.comment_content
                          ?.message
                      }
                      margin="normal"
                      required
                    />
                  )}
                />

                <Controller
                  name={`review_product_list.${index}.comment_rating`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Typography component="legend">Đánh giá (*)</Typography>
                      <Rating
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                        value={field.value || 0}
                      />
                      {errors.review_product_list?.[index]?.comment_rating && (
                        <Typography color="error" variant="caption">
                          {
                            errors.review_product_list?.[index]?.comment_rating
                              .message
                          }
                        </Typography>
                      )}
                    </div>
                  )}
                />
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Gửi
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewFormDialog;
