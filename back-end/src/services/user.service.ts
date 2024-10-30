import UserModel from '@models/user.model';
import { EnumMessageStatus, EnumRole } from '../utils/type';
import ErrorResponse from '../core/error.response';

class UserService {
  // =========================================================================
  // find user information by email
  static findUserInformationByEmail = async ({
    email = '',
    select = {
      email: 1,
      password: 1,
      name: 1,
      phone: 1,
      address: 1,
      roles: 1,
    },
  }) => {
    try {
      const userInformation = await UserModel.findOne({ email })
        .select(select)
        .lean();

      return userInformation;
    } catch (error) {
      throw new ErrorResponse({
        statusCode: 400,
        message: 'User information not found',
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };
}

export default UserService;
