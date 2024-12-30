import { authApi } from "../auth/authApi";
import { VARIANT_URL } from "../../../constant";


export const variantsApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getVariants: build.query({
      query: () => ({
        url: `${VARIANT_URL}/all`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    addVariant: build.mutation({
      query: (variant) => ({
        url: `${VARIANT_URL}`,
        method: "POST",
        body: variant,
      }),
    }),
    updateVariant: build.mutation({
      query: ({variant, id}) => ({
        url: `${VARIANT_URL}/${id}`,
        method: "PUT",
        body: variant,
      }),
      invalidatesTags: ["Variants"],
    }),
    deleteVariant: build.mutation({
      query: (id) => ({
        url: `${VARIANT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getVariantById: build.query({
      query: (id) => ({
        url: `${VARIANT_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetVariantsQuery,
  useAddVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useGetVariantByIdQuery,
} = variantsApi;