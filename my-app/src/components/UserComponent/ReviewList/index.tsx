import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Rating,
  Typography,
} from '@mui/material';
import CommentApiService from '@services/api/comment';
import {
  CommentResponse,
  CommentResponseMetadata,
} from '@services/api/comment/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@utils/constant';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import 'dayjs/locale/vi'; // Import ngôn ngữ tiếng Việt

// Sample order status timeline

// Đặt ngôn ngữ mặc định là tiếng Việt
dayjs.locale('vi');

const ReviewList = ({ productId }: { productId: string }) => {
  // =============================================================================
  // =============================================================================
  const [reviewList, setReviewList] = useState<CommentResponse[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    isPendingCall: false,
    productId,
  });
  const [totalSearchCount, setTotalSearchCount] = useState(0);

  // =============================================================================
  // =============================================================================

  const handleShowMore = () => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        page: searchParams.page + 1,
        isPendingCall: true,
      };
    });
  };

  const handleGetAccountList = () => {
    CommentApiService.getAllCommentOfProductList(searchParams)
      .then((data) => {
        const reviewData = data as CommentResponseMetadata;

        setReviewList([...reviewList, ...reviewData.commentList]);
        setTotalSearchCount(reviewData.totalComments);
      })
      .catch(() => {})
      .finally(() => {
        setSearchParams((searchParams) => {
          return { ...searchParams, isPendingCall: false };
        });
      });
  };

  // =============================================================================
  // =============================================================================
  useEffect(() => {
    handleGetAccountList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  return (
    <Box sx={{ mt: 12, paddingTop: 4, borderTop: '2px solid #e0e0e0' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 'bold', paddingBittom: 4 }}
      >
        Đánh giá sản phẩm
      </Typography>
      <>
        {reviewList &&
          reviewList.map((review, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  {review.userId_document.name} -{' '}
                  <span>
                    {dayjs(review.createdAt).format(
                      'HH:mm:ss [ngày] DD/MM/YYYY'
                    )}
                  </span>
                </Typography>
                <Typography variant="h6">{review.comment_title}</Typography>
                <Rating value={Number(review.comment_rating)} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {review.comment_content}
                </Typography>
              </CardContent>
              <Divider />
            </Card>
          ))}
      </>
      {totalSearchCount - searchParams.page * DEFAULT_LIMIT > 0 && (
        <Button onClick={handleShowMore} variant="contained" color="primary">
          Xem thêm bình luận
        </Button>
      )}
    </Box>
  );
};

export default ReviewList;
