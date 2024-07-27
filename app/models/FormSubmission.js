import mongoose from 'mongoose';

const { Schema } = mongoose;

const formSubmissionSchema = new Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  responses: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const FormSubmission = mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);

export default FormSubmission;
