// // Import các thư viện cần thiết
// const express = require('express');
// const ngrok = require('ngrok');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();
// const PORT = 3000;

// // Cấu hình Stripe API Key và Webhook ID từ .env
// const STRIPE_API_KEY = process.env.STRIPE_SECRET_KEY;
// const STRIPE_WEBHOOK_ID = process.env.STRIPE_WEBHOOK_ID;

// // Hàm cập nhật URL webhook của Stripe
// async function updateStripeWebhook(url) {
//   try {
//     const response = await axios({
//       method: 'post',
//       url: `https://api.stripe.com/v1/webhook_endpoints/${STRIPE_WEBHOOK_ID}`,
//       headers: {
//         Authorization: `Bearer ${STRIPE_API_KEY}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: new URLSearchParams({
//         url: `${url}/webhook`, // Đường dẫn webhook của bạn
//       }),
//     });

//     console.log('Webhook URL updated to:', url);
//     console.log('Stripe response:', response.data);
//   } catch (error) {
//     console.error('Failed to update Stripe webhook:', error.response?.data);
//   }
// }

// // Tự động khởi động ngrok và cập nhật URL khi server bắt đầu
// (async function initializeNgrok() {
//   try {
//     const url = await ngrok.connect(PORT);
//     console.log('Ngrok URL:', url);

//     await updateStripeWebhook(url); // Cập nhật URL webhook của Stripe với URL mới từ ngrok
//   } catch (error) {
//     console.error('Error initializing ngrok:', error);
//   }
// })();

// // Middleware để xử lý webhook từ Stripe
// app.post('/webhook', express.json(), (req, res) => {
//   const event = req.body;
//   console.log('Received Stripe webhook event:', event);
//   res.sendStatus(200);
// });

// // Khởi động server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
