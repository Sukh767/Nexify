import { PRODUCT_URL } from "../../../constant";
import { authApi } from "../auth/authApi";

export const productApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => `${PRODUCT_URL}`,
            method: "GET",
            credentials: "include",
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}`,
                method: "POST",
                body: product,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, product }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: product,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useGetAllProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApiSlice;