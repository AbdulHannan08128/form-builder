import mongoose from 'mongoose';

const { Schema } = mongoose;

// Function to generate a random 32-digit alphanumeric string
const generateRandomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const folderSchema = new Schema({
  folderId: {
    type: String,
    default: generateRandomId,
    unique: true,
  },
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
