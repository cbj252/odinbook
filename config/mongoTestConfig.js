// utils/test-utils/dbHandler.utils.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


async function dbConnect() {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  await mongoose.connect(uri, mongooseOpts);
};

dbConnect();