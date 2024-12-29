import { ORDER_URL } from "../../../constant";
import { authApi } from "../auth/authApi";

export const orderApiSlice = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => `${ORDER_URL}`,
            method: "GET",
            credentials: "include",
        }),
        getOrderByID: builder.query({
            query: (id) => `${ORDER_URL}/${id}`,
            method: "GET",
            credentials: "include",
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `${ORDER_URL}/status/${id}`,
                method: "PATCH",
                body: { status },
            }),
        }),
        editOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `${ORDER_URL}/status/${id}`,
                method: "POST",
                body: { status },
            }),
        }),
    }),
})

export const {
    useGetOrdersQuery,
    useGetOrderByIDQuery,
    useUpdateOrderStatusMutation,
    useEditOrderStatusMutation
} = orderApiSlice;

