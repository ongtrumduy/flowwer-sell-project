import { verify } from 'crypto';
import { model, Schema, Types } from 'mongoose';
import { EnumGender, EnumRole } from '@root/src/utils/type';
import { trim } from 'lodash';
import { DEFAULT_GENDER, DEFAULT_ROLE } from '../utils/constant';
import bcrypt from 'bcryptjs';

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
        validator: function (value) {
          // Kiểm tra xem email có phải Gmail hay không
          const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
          return gmailRegex.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid gmail email address!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    phone_number: {
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
    avatar_url: {
      type: String,
      default: null,
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
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    birth_date: {
      type: Date,
      default: null,
    },
    // ----------------------------------------------------------------},
    gender: {
      type: [String],
      enum: Object.values(EnumGender),
      default: DEFAULT_GENDER,
    },

    // ----------------------------------------------------------------
    // for reset password
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiration: { type: Number, default: 0 },
    // ----------------------------------------------------------------
    resetAttempts: { type: Number, default: 0 },
    lastResetRequest: { type: Date },
  },
  {
    timestamps: true,
    collection: USER_COLLECTION_NAME,
  }
);

// =======================================================
// create middleware
// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserModel = model(USER_DOCUMENT_NAME, UserSchema);

export default UserModel;
