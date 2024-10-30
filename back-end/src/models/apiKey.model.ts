import { Schema, model, Types } from 'mongoose';
import { EnumPermission } from '@root/src/utils/type';

const APIKEY_DOCUMENT_NAME = 'Api_Keys';
const APIKEY_COLLECTION_NAME = 'Api_Keys_Collection';

const ApiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: [String],
      required: true,
      enum: Object.values(EnumPermission),
    },
    //   createdAt: {
    //     type: Date,
    //     default: Date.now(),
    //     expires: '30d',
    //   },
  },
  {
    timestamps: true,
    collection: APIKEY_COLLECTION_NAME,
  }
);

const ApiKeyModel = model(APIKEY_DOCUMENT_NAME, ApiKeySchema);

export default ApiKeyModel;
