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
            query: (id) => `${PRODUCT_URL}/${id}`,
            method: "GET",
            credentials: "include",
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCT_URL}`,
                method: "POST",
                body: product,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `${PRODUCT_URL}/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCT_URL}/${id}`,
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