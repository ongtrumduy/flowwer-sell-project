import './src/utils/register-aliases'; // Register aliases for module resolution ---> init first

import appExpress from '@src/app';

const PORT = process.env.PORT || 8888;

const server = appExpress.listen(PORT, () => {
  //   console.log(`
  //  ${JSON.stringify(process.env)}`);

  console.log(`Server listening on port ${PORT} `);
});
