import { Schema, Types, model } from 'mongoose';
import { USER_DOCUMENT_NAME } from './user.model';

const KEYTOKEN_DOCUMENT_NAME = 'Key_Tokens';
const KEYTOKEN_COLLECTION_NAME = 'Key_Tokens_Collection';

const KeyTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
      unique: true,
    },
    publicKey: {
      type: String,
      required: true,
      unique: true,
    },
    privateKey: {
      type: String,
      required: true,
      unique: true,
    },
    // for detect refresh token used to anti hack
    refreshTokenUsed: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: KEYTOKEN_COLLECTION_NAME,
    timestamps: true,
  }
);

const KeyTokenModel = model(KEYTOKEN_DOCUMENT_NAME, KeyTokenSchema);

export default KeyTokenModel;
