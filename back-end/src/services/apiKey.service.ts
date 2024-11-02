import ApiKeyModel from '@models/apiKey.model';
import cryto from 'crypto';
import { EnumMessageStatus, EnumPermission } from '../utils/type';
import ErrorDTODataResponse from '../core/error.dto.response';
import { DEFAULT_PERMISSION } from '../utils/constant';

class ApiKeyService {
  static generateApiKey = async () => {
    const newKey = cryto.randomBytes(32).toString('hex');

    const createKey = await ApiKeyModel.create({
      key: newKey,
      status: true,
      permissions: DEFAULT_PERMISSION,
    });

    return {
      code: 201,
      metaData: {
        createKey,
      },
      reasonStatusCode: EnumMessageStatus.CREATED_201,
    };
  };

  static findApiKeyById = async ({ key }: { key: string }) => {
    // generate api key
    // await ApiKeyService.generateApiKey();
    try {
      // convert to normal object with use lean()
      const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();

      return objKey;
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: (error as Error).message,
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };
}

export default ApiKeyService;
