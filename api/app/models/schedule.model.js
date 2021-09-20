module.exports = mongoose => {
  const { Schema } = mongoose;
  const schema = Schema(
    {
      days: {
        type: [Number],
        required: true,
      },
      time: {
        type: Object,
        required: true,
      },
      active: {
        type: Boolean,
        default: true,
      },
      driver: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'driver',
      },
      route: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'route',
      },
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

  const Schedule = mongoose.model('schedule', schema);
  return Schedule;
};
