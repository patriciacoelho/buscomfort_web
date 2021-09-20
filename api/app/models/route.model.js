module.exports = mongoose => {
  const { Schema } = mongoose;
  const schema = Schema(
    {
      prefix: { 
        type: String,
        maxLength: 7,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      spec: String,
      startPoint: Schema.Types.Decimal128,
      endPoint: Schema.Types.Decimal128,
      estimatedDistance: Number, // em Km
      estimatedTime: Number, // em minutos
    },
    { timestamps: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Route = mongoose.model('route', schema);
  return Route;
};
