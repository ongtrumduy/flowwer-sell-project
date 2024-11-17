import crypto from 'crypto';
import nodemailer from 'nodemailer';
import myOAuth2Client from '../configs/config.googleoauth';
import SuccessDTODataResponse from '../core/success.dto.response';
import UserModel from '../models/user.model';
import {
  ADMIN_EMAIL_ADDRESS,
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_MAILER_REFRESH_TOKEN,
} from '../utils/constant';
import { EnumReasonStatusCode } from '../utils/type';
import ErrorDTODataResponse from '../core/error.dto.response';

// const attachments = [
//   {
//     filename: "image1.jpg",
//     path: __dirname + "/image1.jpg",
//   },
// ];

class NodeMailerService {
  // =================================================================
  //
  static handleSendMail = async ({
    emailTo, // Gửi đến ai?
    subject, // Tiêu đề email
    content, // Nội dung email
  }: {
    emailTo: string;
    subject: string;
    content: string;
  }) => {
    return new Promise(async (resolve, reject) => {
      if (!emailTo || !subject || !content) {
        reject(
          new ErrorDTODataResponse({
            message: 'Please enter an email address subject content',
            statusCode: 400,
            reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
          })
        );
      }

      try {
        // get accessToken from OAuth2Client
        const myAccessTokenObject = await myOAuth2Client.getAccessToken();

        const myAccessToken = myAccessTokenObject?.token || '';

        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAUTH2',
            user: ADMIN_EMAIL_ADDRESS,
            clientId: GOOGLE_MAILER_CLIENT_ID,
            clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
            refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: myAccessToken,
          },
        });

        const mailOptions = {
          to: emailTo, // Gửi đến ai?
          subject: subject, // Tiêu đề email
          html: `<h3>${content}</h3>`, // Nội dung email
          // attachments: att++achments, //
        };

        await transport.sendMail(mailOptions);

        resolve(mailOptions);
      } catch (error) {
        reject(error);
      }
    });
  };

  // =================================================================
  //
  static postEmail = async ({
    email, // Gửi đến ai?
    subject, // Tiêu đề email
    content, // Nội dung email
  }: {
    email: string;
    subject: string;
    content: string;
  }) => {
    try {
      // Lấy thông tin gửi lên từ client qua body
      if (!email || !subject || !content) {
        throw new ErrorDTODataResponse({
          message: 'Please enter an email address subject content',
          statusCode: 400,
          reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
        });
      }

      /**
       * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
       * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       */
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();

      // const tokenInfo = await myOAuth2Client.getTokenInfo(
      //   myOAuth2Client.credentials.access_token
      // );
      // console.log(tokenInfo);

      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token || '';

      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAUTH2',
          user: ADMIN_EMAIL_ADDRESS,
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      });

      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: `<h3>${content}</h3>`, // Nội dung email
        // attachments: attachments, //
      };

      await transport.sendMail(mailOptions);

      return new SuccessDTODataResponse({
        message: 'Email Sent Successfully !!!',
        statusCode: 200,
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        metaData: {
          mailOptions,
        },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message || 'Email Sent Failed !!!',
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  // =================================================================
  //
}

export default NodeMailerService;

// https://developers.google.com/workspace/guides/create-credentials#oauth-client-id

// https://developers.google.com/oauthplayground/
