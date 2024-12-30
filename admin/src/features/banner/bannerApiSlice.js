import { authApi } from "../auth/authApi";
import { BANNER_URL } from "../../../constant";

const bannerApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => ({
        url: `${BANNER_URL}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getBannerById: builder.query({
      query: (id) => ({
        url: `${BANNER_URL}/${id}`,
        method: "GET",
      }),
    }),
    createBanner: builder.mutation({
      query: (banner) => ({
        url: `${BANNER_URL}`,
        method: "POST",
        body: banner,
      }),
    }),
    updateBanner: builder.mutation({
      query: ({ id, banner }) => ({
        url: `${BANNER_URL}/${id}`,
        method: "PUT",
        body: banner,
      }),
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${BANNER_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
