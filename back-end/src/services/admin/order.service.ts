import cloudinaryConfig from '@root/src/configs/config.cloudinary';
import { Types } from 'mongoose';

import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import SuccessDTODataResponse from '@root/src/core/success.dto.response';
import OrderModel from '@root/src/models/order.model';
import { EnumMessageStatus, EnumPermission, EnumReasonStatusCode, EnumRole, EnumStatusOfOrder } from '@root/src/utils/type';
import fs from 'fs';
import { nanoid } from 'nanoid';
import UserModel, { USER_COLLECTION_NAME, USER_DOCUMENT_NAME } from '@root/src/models/user.model';
import { PRODUCT_COLLECTION_NAME, PRODUCT_DOCUMENT_NAME } from '@root/src/models/product.model';

const cloudinary = cloudinaryConfig();

class AdminOrderService {
  //=====================================================================
  // get all order list version2
  static getAllOrderListV2 = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $search: {
          index: 'default',
          text: {
            query: searchName,
            path: ['order_name'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================

    data.push({
      $project: {
        order_code: 1,
        total_amount: 1,
        delivery_address: 1,
        order_item_list: 1,
        delivery_date: 1,
        order_date: 1,
        shipperId: 1,
        customerId: 1,
        pickup_address: 1,
        pickup_date: 1,
        order_status_stage: 1,
        process_timeline: 1,
        orderId: '$_id', // Đổi tên trường _id thành orderId
        _id: 0,
      },
    });
    data.push({
      $sort: { createdAt: -1 } as Record<string, 1 | -1>, // Sắp xếp theo ngày tạo
    });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount', // Đếm tổng số sản phẩm
          },
        ],
      },
    });

    const categories = await OrderModel.aggregate(pipeline);

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List Order Successfully !!!',
    });
  };

  //=====================================================================
  // get all order list
  static getAllOrderList = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $match: {
          $or: [{ $text: { $search: searchName } }, { name: { $regex: searchName, $options: 'i' } }],
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================
    data.push({
      $project: {
        order_code: 1,
        total_amount: 1,
        delivery_address: 1,
        order_item_list: 1,
        delivery_date: 1,
        order_date: 1,
        shipperId: 1,
        customerId: 1,
        pickup_address: 1,
        pickup_date: 1,
        order_status_stage: 1,
        process_timeline: 1,
        orderId: '$_id', // Đổi tên trường _id thành orderId
        _id: 0,

        ...(searchName ? { score: { $meta: 'textScore' } } : {}),
      },
    });
    data.push({
      $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) } as Record<string, 1 | -1>,
    });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount',
          },
        ],
      },
    });

    const categories = await OrderModel.aggregate(pipeline);

    return {
      code: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  // =====================================================================
  // get all order list version 3
  // static getAllOrderListV3 = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
  //   const pipeline: any[] = [];

  //   // Tìm kiếm theo tên đơn hàng (searchName)
  //   if (searchName) {
  //     pipeline.push({
  //       $search: {
  //         index: 'default',
  //         text: {
  //           query: searchName,
  //           path: ['order_name'],
  //           fuzzy: {
  //             maxEdits: 2,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   // Lookup để lấy product_name từ bảng Products
  //   pipeline.push({
  //     $unwind: '$order_item_list', // Tách mảng order_item_list để xử lý từng item riêng
  //   });

  //   pipeline.push({
  //     $lookup: {
  //       from: 'Products_Collection', // Tên collection của bảng Products
  //       localField: 'order_item_list.productId', // Nối theo productId
  //       foreignField: '_id', // Khóa chính trong Products
  //       as: 'productDetails',
  //     },
  //   });

  //   pipeline.push({
  //     $unwind: {
  //       path: '$productDetails',
  //       preserveNullAndEmptyArrays: true, // Nếu không tìm thấy productDetails thì trả về null
  //     },
  //   });

  //   // Gom nhóm lại (sau khi tách mảng)
  //   pipeline.push({
  //     $group: {
  //       _id: '$_id', // Nhóm lại theo từng đơn hàng
  //       order_code: { $first: '$order_code' },
  //       total_amount: { $first: '$total_amount' },
  //       delivery_address: { $first: '$delivery_address' },
  //       order_date: { $first: '$order_date' },
  //       shipperId: { $first: '$shipperId' },
  //       customerId: { $first: '$customerId' },
  //       pickup_address: { $first: '$pickup_address' },
  //       delivery_date: { $first: '$delivery_date' },
  //       order_status_stage: { $first: '$order_status_stage' },
  //       process_timeline: { $first: '$process_timeline' },
  //       order_item_list: {
  //         $push: {
  //           productId: '$order_item_list.productId',
  //           product_quantity: '$order_item_list.product_quantity',
  //           product_price_now: '$order_item_list.product_price_now',
  //           product_name: '$productDetails.product_name', // Thêm product_name
  //         },
  //       },
  //     },
  //   });

  //   // Pagination
  //   pipeline.push({ $skip: (page - 1) * limit });
  //   pipeline.push({ $limit: limit });

  //   // Chọn các trường cần trả về
  //   pipeline.push({
  //     $project: {
  //       order_code: 1,
  //       total_amount: 1,
  //       delivery_address: 1,
  //       order_item_list: 1,
  //       delivery_date: 1,
  //       order_date: 1,
  //       shipperId: 1,
  //       customerId: 1,
  //       pickup_address: 1,
  //       order_status_stage: 1,
  //       process_timeline: 1,
  //       orderId: '$_id', // Đổi tên _id thành orderId
  //       _id: 0,
  //     },
  //   });

  //   // Tổng quan
  //   pipeline.push({
  //     $facet: {
  //       data: pipeline,
  //       overview: [
  //         {
  //           $count: 'totalSearchCount', // Đếm tổng số đơn hàng
  //         },
  //       ],
  //     },
  //   });

  //   // Thực thi pipeline
  //   const orders = await OrderModel.aggregate(pipeline);

  //   return new SuccessDTODataResponse({
  //     statusCode: 200,
  //     metaData: {
  //       orders: { ...orders },
  //     },
  //     reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
  //     message: 'Get List Order Successfully !!!',
  //   });
  // };

  static getAllOrderListV3 = async ({
    limit,
    page,
    searchName,
    orderStatus,
  }: {
    limit: number;
    page: number;
    searchName: string;
    orderStatus: EnumStatusOfOrder | 'ALL';
  }) => {
    const allPipeline = [];

    const dataPipeline: any[] = [];
    const overviewPipeline: any[] = [];

    // Tìm kiếm theo tên đơn hàng (searchName)
    if (searchName) {
      allPipeline.push({
        $match: {
          $or: [
            { $text: { $search: searchName } }, // Tìm kiếm full-text
            { order_code: { $regex: `.*${searchName}.*`, $options: 'i' } }, // Tìm kiếm gần đúng
          ],
        },
      });
    }

    if (orderStatus && orderStatus !== 'ALL') {
      allPipeline.push({
        $match: { order_status_stage: orderStatus },
      });
    }

    // Lookup để lấy product_name từ bảng Products
    dataPipeline.push(
      { $unwind: '$order_item_list' },
      {
        $lookup: {
          from: PRODUCT_COLLECTION_NAME,
          localField: 'order_item_list.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true,
        },
      }
    );

    // Lookup để lấy thông tin từ bảng Customers và Shippers
    dataPipeline.push(
      // Lookup customer details
      {
        $lookup: {
          from: USER_COLLECTION_NAME, // Tên collection chứa thông tin khách hàng
          localField: 'customerId', // Trường chứa ID khách hàng trong đơn hàng
          foreignField: '_id', // Khóa chính trong collection Customers
          as: 'customerDetails', // Kết quả trả về dưới dạng mảng
        },
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true, // Nếu không có thông tin khách hàng, trả về null
        },
      },

      // Lookup shipper details
      {
        $lookup: {
          from: USER_COLLECTION_NAME, // Tên collection chứa thông tin shipper
          localField: 'shipperId', // Trường chứa ID shipper trong đơn hàng
          foreignField: '_id', // Khóa chính trong collection Shippers
          as: 'shipperDetails', // Kết quả trả về dưới dạng mảng
        },
      },
      {
        $unwind: {
          path: '$shipperDetails',
          preserveNullAndEmptyArrays: true, // Nếu không có thông tin shipper, trả về null
        },
      }
    );

    // Gom nhóm lại (sau khi tách mảng)
    dataPipeline.push({
      $group: {
        _id: '$_id',
        order_code: { $first: '$order_code' },
        total_amount: { $first: '$total_amount' },
        delivery_address: { $first: '$delivery_address' },
        order_date: { $first: '$order_date' },
        shipperId: { $first: '$shipperId' },
        customerId: { $first: '$customerId' },
        pickup_address: { $first: '$pickup_address' },
        delivery_date: { $first: '$delivery_date' },
        order_status_stage: { $first: '$order_status_stage' },
        process_timeline: { $first: '$process_timeline' },
        order_item_list: {
          $push: {
            productId: '$order_item_list.productId',
            product_quantity: '$order_item_list.product_quantity',
            product_price_now: '$order_item_list.product_price_now',
            product_name: '$productDetails.product_name',
          },
        },
        customerDetails: { $first: '$customerDetails' }, // Thêm thông tin chi tiết customer
        shipperDetails: { $first: '$shipperDetails' }, // Thêm thông tin chi tiết shipper

        ...(searchName ? { score: { $first: '$score' } } : {}), // Lưu điểm số vào nhóm
      },
    });

    // Pagination
    dataPipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    // Chọn các trường cần trả về
    dataPipeline.push({
      $project: {
        order_code: 1,
        total_amount: 1,
        delivery_address: 1,
        order_item_list: 1,
        delivery_date: 1,
        order_date: 1,
        shipperId: 1,
        customerId: 1,
        pickup_address: 1,
        pickup_date: 1,
        order_status_stage: 1,
        process_timeline: 1,
        customerDetails: 1, // Thêm thông tin chi tiết của customer
        shipperDetails: 1, // Thêm thông tin chi tiết của shipper
        orderId: '$_id', // Đổi tên _id thành orderId
        ...(searchName ? { score: { $meta: 'textScore' } } : {}),
      },
    });

    // Sắp xếp
    dataPipeline.push({
      $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) },
    });

    // Tạo pipeline cho tổng quan (đếm số lượng)
    overviewPipeline.push({
      $count: 'totalSearchCount',
    });

    // Tổng hợp pipeline
    allPipeline.push({
      $facet: {
        data: dataPipeline,
        overview: overviewPipeline,
      },
    });

    // Thực thi pipeline
    const orders = await OrderModel.aggregate(allPipeline);

    // Xử lý kết quả trả về
    const { data, overview } = orders[0];
    const totalSearchCount = overview[0]?.totalSearchCount || 0;

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        orders: data,
        totalSearchCount,
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List Order Successfully !!!',
    });
  };

  //=====================================================================
  // get order item detail
  static getOrderItemDetail = async ({ orderId }: { orderId: string }) => {
    try {
      const orderDetail = await OrderModel.findOne({
        _id: new Types.ObjectId(orderId),
      })
        .select({
          order_name: 1,
          order_description: 1,
          _id: 0,
        })
        .lean();

      if (!orderDetail) {
        throw new ErrorDTODataResponse({
          reasonStatusCode: EnumMessageStatus.NOT_FOUND_404,
          statusCode: 404,
          message: 'Order Not Found !!!',
        });
      }

      const returnOrderDetail = {
        order_code: orderDetail.order_code,
        total_amount: orderDetail.total_amount,
        delivery_address: orderDetail.delivery_address,
        order_item_list: orderDetail.order_item_list,
      };

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          orderDetail: { ...returnOrderDetail, orderId: orderId },
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Order Detail Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message,
        statusCode: 400,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };

  //=====================================================================
  // create new order
  static createNewOrder = async ({
    order_name,
    order_description,
    orderImagePath,
    orderImageFieldName,
  }: {
    order_name: string;
    order_description: string;
    orderImagePath: string;
    orderImageFieldName: string;
  }) => {
    try {
      let result;

      if (orderImagePath && orderImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(orderImagePath, {
          folder: orderImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${orderImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(orderImagePath);
      }

      const newOrder = await OrderModel.create({
        order_name: order_name,
        order_description: order_description,
      });

      const newReturnOrder = {
        ...newOrder,
        orderId: String(newOrder._id),
      };

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          newReturnOrder,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create new order successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message || 'Create new order fail !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
      });
    }
  };

  //=====================================================================
  // update order
  static updateOrder = async ({
    order_name,
    order_description,
    orderImagePath,
    orderImageFieldName,
    orderId,
  }: {
    order_name: string;
    order_description: string;
    orderId: string;
    orderImagePath: string;
    orderImageFieldName: string;
  }) => {
    try {
      const order = await OrderModel.findOne({
        _id: new Types.ObjectId(orderId),
      });

      if (!order) {
        throw new ErrorDTODataResponse({
          message: 'Order not found !!!',
          statusCode: 400,
          reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
        });
      }

      let result;

      if (orderImagePath && orderImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(orderImagePath, {
          folder: orderImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${orderImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(orderImagePath);
      }

      // order.ord = order_name ? order_name : order.order_name;
      // order.order_description = order_description ? order_description : order.order_description;

      order.save();

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          order,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Order Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Update Order Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // delete order
  static deleteOrder = async ({ orderId }: { orderId: string }) => {
    try {
      const deletedOrder = await OrderModel.findByIdAndDelete({
        _id: new Types.ObjectId(orderId),
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          deletedOrder,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Delete Order Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Delete Order Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // get shipper data list
  static getShipperDataList = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    try {
      // Lấy tất cả shipper
      const query = {
        role_list: EnumRole.SHIPPER,
        ...(searchName && { name: { $regex: searchName, $options: 'i' } }),
      };

      // Phân trang
      const shippers = await UserModel.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      // const shippers = await UserModel.find({
      //   role_list: EnumRole.SHIPPER,
      // });

      // Tính số lượng đơn hàng mỗi shipper đang giao
      const shipperData = await Promise.all(
        shippers.map(async (shipper) => {
          const currentOrders = await OrderModel.countDocuments({
            shipperId: new Types.ObjectId(shipper._id),
            status: { $in: [EnumStatusOfOrder.PICKED_UP, EnumStatusOfOrder.IN_TRANSIT] }, // Chỉ đếm đơn đang giao
          });

          return {
            shipperId: shipper._id,
            shipper_name: shipper.name,
            shipper_phone_number: shipper.phone_number,
            shipper_email: shipper.email,
            shipper_gender: shipper.gender,
            shipper_address: shipper.address,
            currentOrders,
          };
        })
      );

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          shipperData,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Shipper Data List successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Get Shipper Data List Fail!!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AdminOrderService;
