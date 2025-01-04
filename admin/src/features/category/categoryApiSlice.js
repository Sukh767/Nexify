import { authApi } from "../auth/authApi";
import { CATEGORY_URL } from "../../../constant";

export const categoryApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query({
        query: () => ({
            url: `${CATEGORY_URL}/all`,
            method: "GET",
            credentials: "include",
        }),
        keepUnusedDataFor: 5,
        }),
        createCategory: builder.mutation({
        query: (categoryData) => ({
            url: `${CATEGORY_URL}`,
            method: "POST",
            body: categoryData,
        }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
              url: `${CATEGORY_URL}/${id}`,
              method: 'PUT',
              body: data,
            }),
            // Optionally, you can add invalidatesTags to refetch categories after an update
            invalidatesTags: ['Category'],
          }),
        getCategoryById: builder.query({
        query: (id) => ({
            url: `${CATEGORY_URL}/${id}`,
            method: "GET",
            credentials: "include",
        }),
        }),
        getEmptyParentCategoryList: builder.query({
        query: () => ({
            url: `${CATEGORY_URL}/single`,
            method: "GET",
            credentials: "include",
        }),
        }),
        getChildCategoryList: builder.query({
        query: () => ({
            url: `${CATEGORY_URL}/child-category`,
            method: "GET",
            credentials: "include",
        }),
        }),
        deleteCategory: builder.mutation({
        query: (id) => ({
            url: `${CATEGORY_URL}/${id}`,
            method: "DELETE",
        }),
        }),
    }),
})

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoryByIdQuery,
    useGetEmptyParentCategoryListQuery,
    useGetChildCategoryListQuery,
} = categoryApiSlice;