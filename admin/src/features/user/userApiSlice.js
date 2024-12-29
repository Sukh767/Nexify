
import { USER_URL } from "../../../constant";
import { authApi } from "../auth/authApi";

export const userApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USER_URL}/admin-login`,
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    refreshToken: builder.query({
      query: () => `${USER_URL}/refresh-token`,
    }),
    setNewPassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: `${USER_URL}/set-password`,
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: `${USER_URL}/userinfo`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getAllUserList: builder.query({
      query: () => ({
        url: `${USER_URL}/list`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `${USER_URL}/update-profile/${id}`,
        method: "PUT",
        body: userData,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/me/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${USER_URL}/update-user-status`,
        method: "POST",
        body: { id, status },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, isAdmin }) => ({
        url: `${USER_URL}/update-user-role`,
        method: "POST",
        body: { id, isAdmin },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenQuery,
  useSetNewPasswordMutation,
  useGetUserDetailsQuery,
  useGetAllUserListQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
} = userApiSlice;

