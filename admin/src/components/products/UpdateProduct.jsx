import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { XCircle, Plus, Loader } from 'lucide-react';
import {useUpdateProductMutation, useGetProductQuery} from '../../features/products/productsApiSlice';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading, error } = useGetProductQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    productName: '',
    productUrl: '',
    brand: '',
    sizes: [],
    colors: [],
    parentCategory: '',
    short_description: '',
    description: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    mrp_price: '',
    selling_price: '',
    stock: '',
    weight: '',
    weight_unit: '',
    dimensions: '',
    featuredProduct: false,
    isTrending: false,
    isNewArrival: false,
    tags: '',
    status: '',
    discount: '',
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (productData) {
      const { data } = productData;
      setFormData(data);
      setImages(data.images || []);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [e.target.name]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'sizes' ? { size: '', stock: '' } : { colorName: '', colorCode: '' }]
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'sizes' || key === 'colors') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });

    images.forEach(img => {
      submitData.append('existingImages', JSON.stringify(img));
    });

    newImages.forEach(img => {
      submitData.append('images', img);
    });

    try {
     const res = await updateProduct({ id, data: submitData }).unwrap();
     console.log(res);
     
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update product');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-800"><Loader className="animate-spin text-white" size={48} /></div>;
  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div className="min-h-screen p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 ">
        <h2 className="text-3xl font-bold mb-6 text-white font-mono">UPDATE PRODUCT</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Product Name</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Product URL</label>
            <input type="text" name="productUrl" value={formData.productUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Brand</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Parent Category</label>
            <input type="text" name="parentCategory" value={formData.parentCategory} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Short Description</label>
            <textarea name="short_description" value={formData.short_description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Meta Title</label>
            <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Meta Description</label>
            <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Meta Keywords</label>
            <input type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">MRP Price</label>
            <input type="number" name="mrp_price" value={formData.mrp_price} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Selling Price</label>
            <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Weight</label>
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Weight Unit</label>
            <input type="text" name="weight_unit" value={formData.weight_unit} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Dimensions</label>
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Tags</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Discount</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Sizes</label>
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex items-center mb-2">
              <input type="text" name="size" value={size.size} onChange={(e) => handleArrayChange(e, index, 'sizes')} placeholder="Size" className="mr-2 bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="number" name="stock" value={size.stock} onChange={(e) => handleArrayChange(e, index, 'sizes')} placeholder="Stock" className="mr-2 bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <button type="button" onClick={() => removeArrayItem(index, 'sizes')} className="text-red-500"><XCircle size={20} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('sizes')} className="mt-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Size
          </button>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Colors</label>
          {formData.colors.map((color, index) => (
            <div key={index} className="flex items-center mb-2">
              <input type="text" name="colorName" value={color.colorName} onChange={(e) => handleArrayChange(e, index, 'colors')} placeholder="Color Name" className="mr-2 bg-gray-700 border border-gray-600 shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <input type="color" name="colorCode" value={color.colorCode} onChange={(e) => handleArrayChange(e, index, 'colors')} className="mr-2 h-10 w-10 bg-gray-700 border border-gray-600 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <button type="button" onClick={() => removeArrayItem(index, 'colors')} className="text-red-500"><XCircle size={20} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('colors')} className="mt-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Color
          </button>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  <XCircle size={20} />
                </button>
              </div>
            ))}
            {newImages.map((img, index) => (
              <div key={`new-${index}`} className="relative">
                <img src={URL.createObjectURL(img)} alt={`New Product ${index + 1}`} className="w-full h-32 object-cover" />
                <button type="button" onClick={() => removeImage(index, true)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
          <input type="file" onChange={handleImageChange} multiple accept="image/*" className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-center">
            <input type="checkbox" name="featuredProduct" checked={formData.featuredProduct} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="featuredProduct" className="ml-2 block text-sm text-gray-300">Featured Product</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="isTrending" className="ml-2 block text-sm text-gray-300">Trending</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="isNewArrival" className="ml-2 block text-sm text-gray-300">New Arrival</label>
          </div>
        </div>
        
        <div className="mt-8">
          <button type="submit" disabled={isUpdating} className="w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isUpdating ? <Loader className="animate-spin mx-auto" size={24} /> : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;

