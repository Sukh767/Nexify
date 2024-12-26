import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "./authSlice";
import { BASE_URL, USER_URL } from "../../../constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL, // Replace with your backend URL
  credentials: "include", // Include cookies for refresh token
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Attempt to refresh token
    const refreshResult = await baseQuery(
      `${USER_URL}/refresh-token`,
      api,
      extraOptions,
    );
    console.log("Refresh Result:", refreshResult);
    if (refreshResult.data) {
      api.dispatch(
        setCredentials({
          userInfo: api.getState().auth.userInfo,
          accessToken: refreshResult.data.accessToken,
        })
      );
      result = await baseQuery(args, api, extraOptions); // Retry original query
    } else {
      api.dispatch(clearCredentials()); // Clear state if refresh fails
    }
  }

  return result;
};

export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User","Cart", "Order"],
  endpoints: (builder) => ({}),
});
