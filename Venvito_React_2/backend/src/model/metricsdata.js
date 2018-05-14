import mongoose from 'mongoose';

const metricsDataSchema = mongoose.Schema({
  code: { type: String, required: true },
  date: { type: Number, required: true },
  value: { type: Number, required: true },
});

metricsDataSchema.index({ code: 1, date: 1 }, { unique: true });

const MetricsData = module.exports = mongoose.model('MetricsData', metricsDataSchema, 'MetricsData')
