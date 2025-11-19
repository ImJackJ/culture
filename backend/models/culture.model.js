const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cultureSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    content: { type: Object, required: true },
}, {
    timestamps: true,
});

const Culture = mongoose.model('Culture', cultureSchema);

module.exports = Culture;
