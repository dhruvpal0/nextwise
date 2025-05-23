import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut } from '../authSlice';

const USER_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/user/` //'http://localhost:8080/api/v1/user/';
console.log("API URL:", import.meta.env.VITE_API_URL);

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ["Refetch_Logout"],
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API_URL,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: 'register',
                method: 'POST',
                body: inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: 'login',
                method: 'POST',
                body: inputData
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }

        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Logout success:", result.data);
                    dispatch(userLoggedOut({ user: null }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET',
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: 'profile/update',
                method: 'PUT',
                body: formData,
                // credentials: 'include'
            })
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;
