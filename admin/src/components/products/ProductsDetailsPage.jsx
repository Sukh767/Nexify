import React from 'react'
import { useGetProductQuery } from '../../features/products/productsApiSlice'

const ProductsDetailsPage = () => {
    const {getproduct} = useGetProductQuery(id)
  return (
    <div>ProductsDetailsPage</div>
  )
}

export default ProductsDetailsPage