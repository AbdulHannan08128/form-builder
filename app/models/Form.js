import mongoose from 'mongoose';

// Define the schema for the form fields
const fieldSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true // Ensure each field has a unique ID
  },
  type: {
    type: String,
    required: true,
    enum: [
      'text', 'email', 'number', 'password', 'tel', 'url', 
      'date', 'time', 'datetime-local', 'month', 'week', 
      'range', 'color', 'checkbox', 'radio', 'select', 
      'textarea', 'file', 'hidden'
    ] // Validate field types against a list of allowed types
  },
  label: {
    type: String,
    required: true
  },
  options: [String], // For fields like select, radio, checkbox
  defaultOption: {
    type: String,
    default: '' // Default value for select and radio fields
  }
});

// Define the schema for the form
const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    unique: true // Ensure each form has a unique name
  },
  fields: [fieldSchema] // Embed field schema within the form schema
});

// Export the Form model, using `mongoose.models.Form` to handle model reuse
export default mongoose.models.Form || mongoose.model('Form', formSchema);
