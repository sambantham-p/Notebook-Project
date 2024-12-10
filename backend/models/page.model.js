const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  title: { type: 'string' },
  content: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model('Page', pageSchema);
