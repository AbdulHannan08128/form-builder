import mongoose from 'mongoose';

const { Schema } = mongoose;

const formSchema = new Schema({
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
