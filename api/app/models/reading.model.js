module.exports = mongoose => {
  const { Schema } = mongoose;
  const schema = Schema(
    {
      gpsLocation: {
        type: [Schema.Types.Decimal128],
        required: true,
      },
      gpsDatetime: {
        type: Date,
        required: true,
      },
      comfort: String,
      temperature: String,
      humidity: String,
      thermalComfort: String,
      maxNoise: String,
      noise: [String],
      noiseComfort: String,
      jerk: [String],
      speed: String,
      rideComfort: String,
      bus: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'bus',
      },
    },
    { timestamps: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Reading = mongoose.model('reading', schema);
  return Reading;
};
