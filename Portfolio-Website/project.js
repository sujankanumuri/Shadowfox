const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], required: true },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' },
  category: { type: String, default: 'Web' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);