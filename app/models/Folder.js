import mongoose from 'mongoose';

const { Schema } = mongoose;

const folderSchema = new Schema({
  folderName: {
    type: String,
    required: true,
  },
  forms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema);

export default Folder;
