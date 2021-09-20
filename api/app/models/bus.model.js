module.exports = mongoose => {
  const { Schema } = mongoose;

  const schema = Schema(
    {
      prefixCode: {
        type: String,
        maxLength: 7,
        unique: true,
        required: true,
      },
      licensePlate: String,
      category: {
        type: String,
        enum: ['Ônibus Circular', 'Ônibus Padron', 'Ônibus Articulado', 'Ônibus Linha Direta'],
      },

      // module props
      uid: String,
      model: String,
      netId: {
        type: Number,
        required: true,
      },
      network: {
        type: Number,
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

  const Bus = mongoose.model('bus', schema);
  return Bus;
};
