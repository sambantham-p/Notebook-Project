const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: { type: [String], default: [] },
  created_at: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model('Note', noteSchema);
