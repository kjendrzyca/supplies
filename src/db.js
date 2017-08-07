const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
  data: {type: String, required: true},
})

dataSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})

module.exports = {
  dataSchema,
}
