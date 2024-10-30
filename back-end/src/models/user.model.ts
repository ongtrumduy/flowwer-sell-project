import { verify } from 'crypto';
import { model, Schema, Types } from 'mongoose';
import { EnumRole } from '@root/src/utils/type';
import { trim } from 'lodash';
import { DEFAULT_ROLE } from '../utils/constant';

export const USER_DOCUMENT_NAME = 'Users';
const USER_COLLECTION_NAME = 'Users_Collection';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,

      // match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,

      // match: [
      //   /^(?:\+84|0)\d{9,10}$/,
      //   'Please enter a valid Vietnamese phone number',
      // ],
      validate: {
        validator: function (v: string) {
          return /^(03|05|07|08|09)[0-9]{8}$/.test(v);
        },
        message: (props: { value: any }) =>
          `${props.value} is not a valid Vietnamese phone number!`,
      },
    },
    address: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      enum: Object.values(EnumRole),
      default: DEFAULT_ROLE,
    },
    status: {
      type: Boolean,
      default: true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: USER_COLLECTION_NAME,
  }
);

const UserModel = model(USER_DOCUMENT_NAME, UserSchema);

export default UserModel;
