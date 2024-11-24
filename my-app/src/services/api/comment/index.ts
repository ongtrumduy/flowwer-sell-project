import AxiosConfigService from '@services/axios';
import { COMMENT_API } from '@services/constant';

class CommentApiService {
  // ===========================================================================
  // get all comment of product list
  static getAllCommentOfProductList = ({
    productId,
    limit,
    page,
  }: {
    productId: string;
    limit: number;
    page: number;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: COMMENT_API.GET_ALL_COMMENT_OF_PRODUCT_LIST(),
        params: {
          productId,
          limit,
          page,
        },
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get shipper data list
  static sendReviewContentToProduct = ({
    productId,
    comment_title,
    comment_content,
    comment_rating,
  }: {
    productId: string;
    comment_title: string;
    comment_content: string;
    comment_rating: number;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: COMMENT_API.SEND_REVIEW_CONTENT_TO_PRODUCT({ productId }),
        data: {
          comment_title,
          comment_content,
          comment_rating,
        },
      })
        .then((data) => {
          console.log('33 data createOrderForCustomer ===>', data);
          const returnData = data as {
            metaData: unknown;
          };

          resolve(returnData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default CommentApiService;
