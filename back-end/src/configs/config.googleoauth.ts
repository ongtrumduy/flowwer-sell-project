import { google } from 'googleapis';
import {
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_MAILER_REFRESH_TOKEN,
  GOOGLE_REDIRECT_URI,
} from '../utils/constant';

// import { OAuth2Client } from 'google-auth-library';

// const myOAuth2Client = new OAuth2Client(
//   GOOGLE_MAILER_CLIENT_ID,
//   GOOGLE_MAILER_CLIENT_SECRET,
//   GOOGLE_REDIRECT_URI
// );

// myOAuth2Client.setCredentials({
//   refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
// });
// // myOAuth2Client.setOAuth2Client()

// export default myOAuth2Client;

const myOAuth2Client = new google.auth.OAuth2(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

myOAuth2Client.setCredentials({ refresh_token: GOOGLE_MAILER_REFRESH_TOKEN });

export default myOAuth2Client;
