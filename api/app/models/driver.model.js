module.exports = mongoose => {
  const { Schema } = mongoose;
  const schema = Schema(
    {
      name: {
        type: String,
        minLength: 3,
        required: true,
      },
      cpf: {
        type: String,
        unique: true,
        minLength: 14,
        maxLength: 14,
        required: true,
      },
    },
    { timestamps: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Driver = mongoose.model('driver', schema);
  return Driver;
};
