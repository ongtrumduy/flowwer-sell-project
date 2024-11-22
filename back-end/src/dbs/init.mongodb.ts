import mongoose from 'mongoose';

import config from '@configs/config.mongodb';

const { format, host, port, name, username, password, appname } = config.db;

const connectString = `${format}://${host}:${port}/${name}?directConnection=true&tls=true`;

const connectString_atlas = `${format}://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${appname}&tls=true&authMechanism=DEFAULT`;

class Database {
  static instance: any;

  constructor() {
    this.connect();
  }

  // Đảm bảo mongoose.connect bật useUnifiedTopology
  // Session không hoạt động nếu không bật useUnifiedTopology
  connect() {
    mongoose
      .connect(connectString_atlas, {
        maxPoolSize: 40,
        serverSelectionTimeoutMS: 4000,
        socketTimeoutMS: 4000,
      })
      .then(() => {
        console.log('Connected to MongoDB !!!', { connectString_atlas });
      })
      .catch((error) => {
        console.log(
          'MongoDB connection error. Please make sure MongoDB is running. ',
          { connectString_atlas, error }
        );
        process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = () => {
  return Database.getInstance();
};

export default instanceMongodb;
