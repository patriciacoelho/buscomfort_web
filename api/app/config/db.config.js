module.exports = {
  // url: 'mongodb://localhost:27017/buscomfort_db',
  // url: `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER}.pusjb.mongodb.net/${process.env.MONGO_ATLAS_DB_NAME}?retryWrites=true&w=majority`,
  url: `mongodb://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER}-shard-00-00.pusjb.mongodb.net:27017,${process.env.MONGO_ATLAS_CLUSTER}-shard-00-01.pusjb.mongodb.net:27017,${process.env.MONGO_ATLAS_CLUSTER}-shard-00-02.pusjb.mongodb.net:27017/${process.env.MONGO_ATLAS_DB_NAME}?ssl=true&replicaSet=atlas-14726x-shard-0&authSource=admin&retryWrites=true&w=majority`,
};