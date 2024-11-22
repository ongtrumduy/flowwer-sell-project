import UserModel from '@models/user.model';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { nanoid } from 'nanoid';
import cloudinaryConfig from '../configs/config.cloudinary';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import { EnumGender, EnumMessageStatus, EnumReasonStatusCode, EnumRole, InterfacePayload } from '../utils/type';
import { Types } from 'mongoose';
import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';
const cloudinary = cloudinaryConfig();
const suffix_folder = '_cloudinary_upload';

class OverviewService {
  // =========================================================================
  // find user information by email
  static overviewDashboardCountInformation = async ({ haveRoleUser }: { haveRoleUser: InterfacePayload }) => {
    try {
      const checkPermissionRole = haveRoleUser.role_list.some((role) => {
        return [EnumRole.ADMIN, EnumRole.EMPLOYEE].indexOf(role) > -1;
      });

      if (!checkPermissionRole) {
        throw new ErrorDTODataResponse({
          statusCode: 403,
          reasonStatusCode: EnumReasonStatusCode.FORBIDDEN,
          message: 'Not Have Permission To Access This Information !!!',
        });
      }

      // Đếm tổng số tài khoản
      const totalUsers = await UserModel.countDocuments({
        role_list: { $in: [EnumRole.USER] }, // Lọc các tài khoản có 'USER' trong mảng role_list
      });

      // Đếm tổng số đơn hàng
      const totalOrders = await OrderModel.countDocuments();

      // Đếm tổng số san phẩm
      const totalProducts = await ProductModel.countDocuments();

      // Tính tổng số tiền của tất cả đơn hàng
      const totalRevenueResult = await OrderModel.aggregate([
        {
          $group: {
            _id: null, // Gom tất cả lại, không chia nhóm
            totalRevenue: { $sum: '$total_amount' }, // Tính tổng trường `total_amount`
          },
        },
      ]);

      const totalRevenue = totalRevenueResult.length ? totalRevenueResult[0].totalRevenue : 0;

      console.log('Tổng số tài khoản:', totalUsers);
      console.log('Tổng số đơn hàng:', totalOrders);
      console.log('Tổng số tiền:', totalRevenue);

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Overview Dashboard Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Get Overview Dashboard Failed !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  // =================================================================
  //
  static getRevenueByMonth = async ({ haveRoleUser }: { haveRoleUser: InterfacePayload }) => {
    const checkPermissionRole = haveRoleUser.role_list.some((role) => {
      return [EnumRole.ADMIN, EnumRole.EMPLOYEE].indexOf(role) > -1;
    });

    if (!checkPermissionRole) {
      throw new ErrorDTODataResponse({
        statusCode: 403,
        reasonStatusCode: EnumReasonStatusCode.FORBIDDEN,
        message: 'Not Have Permission To Access This Information !!!',
      });
    }

    const revenueByMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$order_date' },
            month: { $month: '$order_date' },
          },
          totalRevenue: { $sum: '$total_amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const revenueByMonthResult = revenueByMonth.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalRevenue: item.totalRevenue,
      label: `${item._id.month}/${item._id.year}`,
    }));

    return new SuccessDTODataResponse({
      metaData: { revenueByMonthResult },
      message: 'Get Revenue By Month Successfully !!!',
      statusCode: 200,
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
    });
  };

  // =================================================================
  //
  static getUsersByMonth = async ({ haveRoleUser }: { haveRoleUser: InterfacePayload }) => {
    const checkPermissionRole = haveRoleUser.role_list.some((role) => {
      return [EnumRole.ADMIN, EnumRole.EMPLOYEE].indexOf(role) > -1;
    });

    if (!checkPermissionRole) {
      throw new ErrorDTODataResponse({
        statusCode: 403,
        reasonStatusCode: EnumReasonStatusCode.FORBIDDEN,
        message: 'Not Have Permission To Access This Information !!!',
      });
    }

    const usersByMonth = await UserModel.aggregate([
      {
        $match: { role_list: { $in: [EnumRole.USER] } }, // Lọc người dùng có vai trò USER
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const usersByMonthResult = usersByMonth.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalUsers: item.totalUsers,
      label: `${item._id.month}/${item._id.year}`,
    }));

    return new SuccessDTODataResponse({
      metaData: { usersByMonthResult },
      message: 'Get Users By Month Successfully !!!',
      statusCode: 200,
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
    });
  };

  // =================================================================
  //
  static getOrdersByMonth = async ({ haveRoleUser }: { haveRoleUser: InterfacePayload }) => {
    const checkPermissionRole = haveRoleUser.role_list.some((role) => {
      return [EnumRole.ADMIN, EnumRole.EMPLOYEE].indexOf(role) > -1;
    });

    if (!checkPermissionRole) {
      throw new ErrorDTODataResponse({
        statusCode: 403,
        reasonStatusCode: EnumReasonStatusCode.FORBIDDEN,
        message: 'Not Have Permission To Access This Information !!!',
      });
    }

    const ordersByMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$order_date' },
            month: { $month: '$order_date' },
          },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const ordersByMonthResult = ordersByMonth.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalOrders: item.totalOrders,
      label: `${item._id.month}/${item._id.year}`,
    }));

    return new SuccessDTODataResponse({
      metaData: { ordersByMonthResult },
      message: 'Get Orders By Month Successfully !!!',
      statusCode: 200,
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
    });
  };
}

export default OverviewService;
