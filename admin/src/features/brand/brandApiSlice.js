import { authApi } from "../auth/authApi";
import { BRAND_URL } from "../../../constant";

const brandApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: () => ({
        url: `${BRAND_URL}`,
        menthod: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getBrandById: builder.query({
      query: (id) => ({
        url: `${BRAND_URL}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    createBrand: builder.mutation({
      query: (brand) => ({
        url: `${BRAND_URL}`,
        method: "POST",
        body: brand,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ id, brand }) => ({
        url: `${BRAND_URL}/${id}`,
        method: "PUT",
        body: brand,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BRAND_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});


export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;