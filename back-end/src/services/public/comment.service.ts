import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import SuccessDTODataResponse from '@root/src/core/success.dto.response';
import CommentModel from '@root/src/models/comment.model';
import ProductModel from '@root/src/models/product.model';
import { USER_COLLECTION_NAME } from '@root/src/models/user.model';
import { EnumMessageStatus } from '@root/src/utils/type';
import mongoose, { Types } from 'mongoose';

class CommentService {
  // =======================================================
  // get all typeProduct list
  static getAllCommentOfProductList = async ({ productId, limit, page }: { productId: string; limit: number; page: number }) => {
    const commentList = await CommentModel.find({ productId_document: new Types.ObjectId(productId) })
      .populate('userId_document', 'name avatar_url email') // Populate thông tin user (ví dụ: name)
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .limit(limit)
      .skip((page - 1) * limit);

    // Tổng số bình luận
    const totalComments = await CommentModel.countDocuments({ productId_document: new Types.ObjectId(productId) });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        commentList,
        totalComments,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
      message: 'Get All Comment Of Product List Successfully !!!',
    });
  };

  // =======================================================
  // get all typeProduct list version 2
  static getAllCommentOfProductList_V2 = async ({ productId, limit, page }: { productId: string; limit: number; page: number }) => {
    const pipeline = [
      { $match: { productId_document: new Types.ObjectId(productId) } },
      {
        $facet: {
          comments: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: USER_COLLECTION_NAME,
                localField: 'userId_document',
                foreignField: '_id',
                as: 'userDetails',
              },
            },
            { $unwind: '$userDetails' }, // Lấy chi tiết user
          ],
          totalComments: [{ $count: 'count' }],
        },
      },
    ];

    const result = await CommentModel.aggregate(pipeline).exec();

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        commentList: result[0].comments,
        totalComments: result[0].totalComments[0]?.count || 0,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
      message: 'Get All Comment Of Product List Successfully !!!',
    });
  };

  // =======================================================
  // get all typeProduct list
  static sendReviewContentToProduct = async ({
    productId,
    comment_title,
    comment_content,
    comment_rating,
    userId,
  }: {
    productId: string;
    comment_title: string;
    comment_content: string;
    comment_rating: number;
    userId: string;
  }) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Validate sản phẩm có tồn tại không
      const product = await ProductModel.findById(new Types.ObjectId(productId));
      if (!product) {
        throw new Error('Product not found');
      }

      // Tạo mới comment
      const newComment = await CommentModel.create(
        [
          {
            productId_document: new Types.ObjectId(productId),
            comment_title,
            comment_content,
            comment_rating,
            userId_document: new Types.ObjectId(userId),
          },
        ],
        { session }
      );

      // Tính toán lại rating trung bình và tổng số review
      const newTotalReviews = product.product_total_review + 1;
      const totalRating = product.product_average_rating * product.product_total_review + Number(comment_rating);
      const newAverageRating = Number(totalRating / newTotalReviews).toFixed(2);

      // Cập nhật product với dữ liệu mới
      //   await ProductModel.findByIdAndUpdate(productId, {
      //     product_average_rating: newAverageRating,
      //     product_total_reviews: totalReviews,
      //   });

      product.product_total_review = newTotalReviews;
      product.product_average_rating = Number(newAverageRating);

      await product.save({ session });

      // Hoàn tất transaction
      await session.commitTransaction();

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          newComment: newComment,
          product: product,
        },
        reasonStatusCode: EnumMessageStatus.SUCCESS_200,
        message: 'Send Comment To Review Product Successfully !!!',
      });
    } catch (error) {
      // Hoàn tất transaction
      await session.commitTransaction();

      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumMessageStatus.INTERNET_SERVER_ERROR_500,
        message: (error as Error).message,
      });
    } finally {
      session.endSession();
    }
  };
}

export default CommentService;
