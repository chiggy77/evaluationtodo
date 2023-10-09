const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  taskname: { type: String, required: true },
  status: { type: String, enum: ['pending', 'done'], required: true },
  tag: { type: String, enum: ['personal', 'official', 'family'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports={TodoModel}