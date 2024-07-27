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

const formSchema = new Schema({
  formId: {
    type: String,
    default: generateRandomId,
    unique: true,
  },
  formName: {
    type: String,
    required: true,
  },
  fields: [
    {
      type: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      options: [String],
      defaultOption: String,
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

const Form = mongoose.models.Form || mongoose.model('Form', formSchema);

export default Form;
