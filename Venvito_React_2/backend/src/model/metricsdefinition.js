import mongoose from 'mongoose';

const metricsDefinitionSchema = mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: true },
  sortOrder: { type: Number, required: true },
  date: { type: Number },
  value: { type: Number },
});

const MetricsDefinition = module.exports = mongoose.model('MetricsDefinition', metricsDefinitionSchema, 'MetricsDefinition')
