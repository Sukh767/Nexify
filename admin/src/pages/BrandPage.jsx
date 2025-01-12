import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { useDeleteBrandMutation, useGetAllBrandsQuery } from '../features/brand/brandApiSlice';
import toast from 'react-hot-toast';

const BrandCard = ({ brand, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 rounded-t-sm overflow-hidden shadow-lg"
    >
      <img src={brand.logo[0].url} alt={brand.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{brand.name}</h3>
        <p className="text-gray-300 mb-4">{brand.description}</p>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${brand.status ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'}`}>
            {brand.status ? 'Active' : 'Inactive'}
          </span>
          <div className="flex space-x-2">
            <Link to={`/brand/${brand._id}`} className="text-blue-400 hover:text-blue-300">
              <Edit size={20} />
            </Link>
            <button onClick={() => onDelete(brand._id)} className="text-red-400 hover:text-red-300">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BrandPage = () => {
  const { data: brands, isLoading, error, refetch } = useGetAllBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        const response = await deleteBrand(id).unwrap();
        if(response.success){
          toast.success('Brand deleted successfully');
        }
        refetch();
      } catch (err) {
        console.error('Failed to delete the brand:', err);
      }
    }
  };

  if (isLoading) return <div className="text-center text-white text-2xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-2xl">Error: {error.message}</div>;


  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8 mt-2 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Brands</h1>
          <Link
            to="/brand/create-brand"
            className="bg-blue-600 text-white py-2 px-4  hover:bg-blue-700 transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Create Brand
          </Link>
        </div>
        {brands && brands.data.length === 0 && (
          <div className='text-2xl items-start text-center text-amber-400 font-bold font-mono'>NO DATA FOUND</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands && brands.data && brands.data.map((brand) => (
            <BrandCard key={brand._id} brand={brand} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;

