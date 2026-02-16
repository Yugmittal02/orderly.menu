import React, { useState } from 'react';
import { updateProduct, createProduct } from '../../services/api';

const ProductFormModal = ({ product, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: product?.name || "",
        description: product?.description || "",
        category: product?.category || "",
        basePrice: product?.basePrice || "",
        image: product?.image || "",
        sizes: product?.sizes || [],
        addons: product?.addons || [],
    });
    const [newSize, setNewSize] = useState({ name: "", price: "" });
    const [newAddon, setNewAddon] = useState({ name: "", price: "" });
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            // Dynamic import or direct usage if possible. Using dynamic for now to match pattern.
            const { uploadImage } = await import("../../services/api");
            const { data } = await uploadImage(formData);

            setForm({ ...form, image: data.url });
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product) {
                await updateProduct(product._id, form);
            } else {
                await createProduct(form);
            }
            onSave();
        } catch (err) {
            alert("Error saving product");
        }
    };

    const addSize = () => {
        if (newSize.name && newSize.price) {
            setForm({
                ...form,
                sizes: [
                    ...form.sizes,
                    { name: newSize.name, price: Number(newSize.price) },
                ],
            });
            setNewSize({ name: "", price: "" });
        }
    };

    const addAddon = () => {
        if (newAddon.name && newAddon.price) {
            setForm({
                ...form,
                addons: [
                    ...form.addons,
                    { name: newAddon.name, price: Number(newAddon.price) },
                ],
            });
            setNewAddon({ name: "", price: "" });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-bold text-gray-800">
                        {product ? "Edit" : "Add"} Product
                    </h3>
                    <button onClick={onClose} className="text-gray-400 text-2xl">
                        &times;
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="p-5 overflow-y-auto max-h-[70vh] space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Base Price"
                        value={form.basePrice}
                        onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-base"
                        required
                    />

                    {/* Image Upload */}
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">
                            Product Image
                        </p>
                        <div className="flex gap-3 items-center">
                            {form.image ? (
                                <div
                                    className="w-20 h-20 rounded-xl bg-cover bg-center border-2 border-gray-200"
                                    style={{ backgroundImage: `url(${form.image})` }}
                                ></div>
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl border-2 border-dashed border-gray-300">
                                    📷
                                </div>
                            )}
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div
                                    className={`w-full py-3.5 rounded-xl font-bold text-center cursor-pointer transition-all active:scale-95 ${uploading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                                        }`}
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                                            Uploading...
                                        </span>
                                    ) : form.image ? (
                                        "📷 Change Image"
                                    ) : (
                                        "📷 Upload Image"
                                    )}
                                </div>
                            </label>
                        </div>
                        {form.image && (
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, image: "" })}
                                className="text-red-500 text-sm font-medium mt-2"
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">Sizes</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.sizes.map((s, i) => (
                                <span
                                    key={i}
                                    className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm"
                                >
                                    {s.name}: ₹{s.price}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                placeholder="Size"
                                value={newSize.name}
                                onChange={(e) =>
                                    setNewSize({ ...newSize, name: e.target.value })
                                }
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="₹"
                                value={newSize.price}
                                onChange={(e) =>
                                    setNewSize({ ...newSize, price: e.target.value })
                                }
                                className="w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            />
                            <button
                                type="button"
                                onClick={addSize}
                                className="bg-gray-200 px-4 rounded-xl font-bold active:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Addons */}
                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-2">Add-ons</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.addons.map((a, i) => (
                                <span
                                    key={i}
                                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
                                >
                                    {a.name}: ₹{a.price}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                placeholder="Name"
                                value={newAddon.name}
                                onChange={(e) =>
                                    setNewAddon({ ...newAddon, name: e.target.value })
                                }
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="₹"
                                value={newAddon.price}
                                onChange={(e) =>
                                    setNewAddon({ ...newAddon, price: e.target.value })
                                }
                                className="w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                            />
                            <button
                                type="button"
                                onClick={addAddon}
                                className="bg-gray-200 px-4 rounded-xl font-bold active:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 active:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200"
                        >
                            Save
                        </button>
                    </div>
                </form>
                <style>{`
            @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .animate-slide-up { animation: slide-up 0.3s ease-out; }
        `}</style>
            </div>
        </div>
    );
};

export default ProductFormModal;
