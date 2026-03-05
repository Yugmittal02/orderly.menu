const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String }, // URL or base64
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    basePrice: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    sizes: [{
        name: { type: String },
        price: { type: Number }
    }],
    addons: [{
        name: { type: String },
        price: { type: Number }
    }],
    subcategories: [{ type: String }],
    isBestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug from name before validation
productSchema.pre('validate', function () {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
});

// Handle duplicate slugs by appending random suffix
productSchema.pre('save', async function () {
    if (this.isModified('slug') || this.isNew) {
        const baseSlug = this.slug;
        let existing = await mongoose.model('Product').findOne({ slug: this.slug, _id: { $ne: this._id } });
        let attempt = 0;
        while (existing && attempt < 10) {
            const suffix = Math.random().toString(36).substring(2, 6);
            this.slug = `${baseSlug}-${suffix}`;
            existing = await mongoose.model('Product').findOne({ slug: this.slug, _id: { $ne: this._id } });
            attempt++;
        }
    }
});

module.exports = mongoose.model('Product', productSchema);
