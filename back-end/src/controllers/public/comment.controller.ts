import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@root/src/utils/constant';
import CommentService from '@root/src/services/public/comment.service';

class CommentController {
  //=========================================================
  // get all comment of product list version 2
  static getAllCommentOfProductList_V2 = async (req: Request, res: Response, next: NextFunction) => {
    const data = await CommentService.getAllCommentOfProductList({
      productId: String(req.query?.productId),
      limit: Number(req.query?.limit) || DEFAULT_LIMIT,
      page: Number(req.query?.page) || DEFAULT_PAGE,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data?.message || 'Get All Comment Of Product List Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // send review content to product
  static sendReviewContentToProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await CommentService.sendReviewContentToProduct({
      productId: req.params?.productId,
      comment_title: req.body.comment_title,
      comment_content: req.body.comment_content,
      comment_rating: Number(req.body.comment_rating),
      userId: req.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data?.message || 'Get All Comment Of Product List Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default CommentController;
