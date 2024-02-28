import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatRFC3339 } from "date-fns";
import { NewMockup } from "~/types/NewMockup";
import { API_BASE_URL, USE_PASSWORD_LOGIN } from "../config";
import { RootState } from "../redux/store";
import { Activity } from "../types/Activity";
import { CreateAccountPayload } from "../types/CreateAccountPayload";
import { CreateMockupPayload } from "../types/CreateMockupPayload";
import { DeleteMockupPayload } from "../types/DeleteMockupPayload";
import { Folder } from "../types/Folder";
import { ForgotPasswordPayload } from "../types/ForgotPasswordPayload";
import { GetMockupsByUserPayload } from "../types/GetMockupsByUserPayload";
import { IDPayload } from "../types/IDPayload";
import { LoginPayload } from "../types/LoginPayload";
import { Machine } from "../types/Machine";
import { MachineType } from "../types/MachineType";
import { MediaItem } from "../types/MediaItem";
import { Mockup } from "../types/Mockup";
import { Presentation } from "../types/Presentation";
import { PresentationFolder } from "../types/PresentationFolder";
import { QuickLink, parseToQuickLink } from "../types/QuickLink";
import { StrapiLoginPayload } from "../types/StrapiLoginPayload";
import { StrapiUser } from "../types/StrapiUser";
import { SuccessResponse } from "../types/SuccessResponse";
import { Testimonial } from "../types/Testimonial";
import { UpdateMockupPayload } from "../types/UpdateMockupPayload";
import { UploadMockupPayload } from "../types/UploadMockupPayload";
import { User } from "../types/user";
import getAccessToken from "../utils/getAccessToken";

// Define a service using a base URL and expected endpoints
export const wpApi = createApi({
  reducerPath: "wpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      // const { token } = (getState() as RootState).user.user;
      // console.log('🚀 ~ file: wpApi.ts ~ line 37 ~ token', token);
      const token = USE_PASSWORD_LOGIN
        ? (getState() as RootState).user.user?.token
        : await getAccessToken();
      // console.log(
      //   '🚀 ~ file: wpApi.ts ~ line 44 ~ prepareHeaders: ~ token',
      //   token
      // );
      // const user = useSelector(getUser);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Mockup", "Report", "Activity"],
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getQuickLinks: builder.query<Array<QuickLink>, void>({
      query: () => `appquicklinks/getAll/`,

      transformResponse: (response: { data: any }) => {
        const results: Array<QuickLink> = response?.data?.map(parseToQuickLink);
        return results;
      },
    }),

    login: builder.mutation<User, Partial<LoginPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `user/login/`,
        method: "POST",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ LOGIN.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        const user: User = {
          id: response.data[0].ID,
          token: response.data[0].appToken,
          email: response.data[0].data.user_email,
          displayName: response.data[0].data.display_name,
          status: response.data[0].data.user_status === "1",
        };

        return user;
      },
      // invalidatesTags: ['Post'],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    getMe: builder.query<StrapiUser, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => ({
        url: `users/me`,
        method: "GET",
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log('getMe ~ line 116 ~ response', response);
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        // console.log("🚀 ~ file: wpApi.ts ~ line 110 ~ user", user)

        const results: StrapiUser = response as unknown as StrapiUser;
        return results;
      },
    }),
    updatePushTokens: builder.mutation<boolean, any>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `users/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        console.log(
          "🚀 ~ file: wpApi.ts ~ line 146 ~ response updatePushTokens",
          response,
        );

        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        return true;
      },
    }),
    strapiLogin: builder.mutation<User, Partial<StrapiLoginPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `auth/local`,
        method: "POST",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log('🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data', response);
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        const user: User = {
          id: response.user.id,
          token: response.jwt,
          email: response.user.email,
          displayName: response.user.username,
          status: response.user.confirmed,
        };
        // console.log("🚀 ~ file: wpApi.ts ~ line 110 ~ user", user)

        return user;
      },
    }),
    getFoldersStrapi: builder.query<Array<Folder>, void>({
      query: () => ({
        url: `folders`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => {
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        const results: Array<Folder> = response as unknown as Array<Folder>;
        return results;
      },
    }),

    getFolderStrapi: builder.query<Folder, number>({
      query: (payload) => ({
        url: `folders/${payload}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => {
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        const results: Folder = response as unknown as Folder;
        return results;
      },
    }),

    uploadMockup: builder.mutation<SuccessResponse, UploadMockupPayload>({
      // Data must be FormData, to upload.  For example:
      //
      // var data = new FormData();
      // data.append("files.image", fileInput.files[0], "Screen Shot 2021-12-01 at 9.37.30 AM.png");
      // data.append("data", "{\"name\":\"desktop\", \"owner\":2}");

      query: (payload) => ({
        url: `mockups`,
        method: "POST",
        body: payload.form,
        // headers: {
        //   'content-type': 'multipart/form-data',
        // },
      }),
      invalidatesTags: ["Mockup"],
    }),

    createMockup: builder.mutation<
      SuccessResponse,
      Partial<CreateMockupPayload>
    >({
      query: (payload) => ({
        url: `mockups/save/`,
        method: "POST",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response: SuccessResponse) => {

      //   return user;
      // },

      invalidatesTags: ["Mockup"],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    updateMockup: builder.mutation<SuccessResponse, UploadMockupPayload>({
      // Data must be FormData, to upload.  For example:
      //
      // var data = new FormData();
      // data.append("files.image", fileInput.files[0], "Screen Shot 2021-12-01 at 9.37.30 AM.png");
      // data.append("data", "{\"name\":\"desktop\", \"owner\":2}");

      query: (payload) => ({
        url: `mockups/${payload.id}`,
        method: "PUT",
        body: payload.form,
      }),
      invalidatesTags: ["Mockup"],
    }),

    updateMockupName: builder.mutation<boolean, Partial<UpdateMockupPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `mockups/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        return true;
      },
      invalidatesTags: ["Mockup"],
    }),

    createAccount: builder.mutation<boolean, Partial<CreateAccountPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `user/create/`,
        method: "POST",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        return true;
      },
      // invalidatesTags: ['Post'],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    forgotPassword: builder.mutation<boolean, Partial<ForgotPasswordPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `user/forgotPassword/`,
        method: "POST",
        body: payload,
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        return true;
      },
      // invalidatesTags: ['Post'],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    getMockupsByUser: builder.query<
      Array<Mockup>,
      Partial<GetMockupsByUserPayload>
    >({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `mockups?owner.id=${payload.ID}&_sort=${payload.sort_by}:${payload.order}`,
        method: "GET",
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log('🚀 ~ file: wpApi.ts ~ line 377 ~ response', response);

        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<Mockup> = response as unknown as Array<Mockup>;
        return results;

        // console.log('mockup data: ', response.data);

        // return response?.data;
      },
      // providesTags: ['Mockup'],
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ ID }) => ({ type: "Mockup" as const, id: ID })),
              "Mockup",
            ]
          : ["Mockup"],
      // invalidatesTags: ['Post'],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    getMockupByID: builder.query<NewMockup, Partial<IDPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `mockups/${payload.id}`,
        method: "GET",
      }),
      // // Pick out data and prevent nested properties in a hook or selector

      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        try {
          if (response?.data?.errors?.[0]) {
            throw new Error(response.data.errors[0]);
          }

          const results: NewMockup = response as unknown as NewMockup;
          console.log("🚀 ~ file: wpApi.ts ~ line 366 ~ Mockup", results);

          return results;
        } catch (err) {
          console.log("🚀 ~ file: wpApi.ts ~ line 375 ~ err", err);
        }

        // console.log('mockup data: ', response.data);

        // return response?.data;
      },
      // providesTags: ['Mockup'],
      providesTags: (result, error, arg) =>
        result
          ? [{ type: "Mockup" as const, id: result.ID }, "Mockup"]
          : ["Mockup"],
      // invalidatesTags: ['Post'],
      // // onQueryStarted is useful for optimistic updates
      // // The 2nd parameter is the destructured `MutationLifecycleApi`
      // async onQueryStarted(
      //   arg,
      //   { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      // ) {},
      // // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      // async onCacheEntryAdded(
      //   arg,
      //   {
      //     dispatch,
      //     getState,
      //     extra,
      //     requestId,
      //     cacheEntryRemoved,
      //     cacheDataLoaded,
      //     getCacheEntry,
      //   }
      // ) {},
    }),
    getMachines: builder.query<Array<Machine>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `stickers`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        console.log("🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data", response);
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<Machine> = response as unknown as Array<Machine>;
        return results;
      },
    }),
    getMachineTypes: builder.query<Array<MachineType>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `machine-types/getAll/`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<MachineType> = response?.data;
        return results;
      },
    }),
    deleteMockup: builder.mutation<boolean, Partial<DeleteMockupPayload>>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (payload) => ({
        url: `mockups/${payload.post_id}`,
        method: "DELETE",
      }),
      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        return true;
      },
      invalidatesTags: ["Mockup"],
    }),
    getAllPresentations: builder.query<Array<Presentation>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `presentations/getAll/`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<Presentation> = response?.data;
        return results;
      },
    }),
    getPresentationsByFolder: builder.query<Array<Presentation>, string>({
      // note: an optional `queryFn` may be used in place of `query`
      query: (param) => {
        console.log("get pres by folder param; ", param);
        return `appquicklinks/getPresentationsByFolder/${param}`;
      },

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        console.log(
          "🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data",
          response.data,
        );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<Presentation> = response?.data;
        return results;
      },
    }),
    getPresentationFolders: builder.query<Array<PresentationFolder>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `presentations/getFolders/`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<PresentationFolder> = response?.data;
        return results;
      },
    }),
    getFreestyleFolders: builder.query<Array<PresentationFolder>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `presentations-freestyle/getFolders/`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<PresentationFolder> = response?.data;
        return results;
      },
    }),
    getTestimonials: builder.query<Array<Testimonial>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `testimonials/getAll/`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results: Array<Testimonial> = response?.data;
        return results;
      },
    }),
    getMediaItems: builder.query<Array<MediaItem>, void>({
      // note: an optional `queryFn` may be used in place of `query`
      query: () => `media-items?_limit=-1&_sort=name:ASC`,

      // // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }) => {
        // console.log(
        //   '🚀 ~ file: wpApi.ts ~ line 26 ~ esponse.data',
        //   response.data
        // );
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }

        const results = response as unknown as Array<MediaItem>;
        return results;
      },
    }),
    getActivities: builder.query<Array<Activity>, void>({
      query: () => `activities?_limit=20&_sort=created_at:DESC`,
      providesTags: ["Activity"],
      transformResponse: (response: { data: any }) => {
        console.log("🚀 ~ file: wpApi.ts ~ line 662 ~ data", response);
        if (response?.data?.errors?.[0]) {
          throw new Error(response.data.errors[0]);
        }
        const results: Array<Activity> = response as unknown as Array<Activity>;
        return results;
      },
    }),
    getUnreadActivitiesCount: builder.query<number, number>({
      query: (lastReadTimestamp: number) =>
        `/activities/count?created_at_gte=${formatRFC3339(
          new Date(lastReadTimestamp),
        )}`,
      transformResponse: (response: { data: any }) => {
        console.log("🚀 ~ file: wpApi.ts ~ line 662 ~ data", response);
        // if (response?.data?.errors?.[0]) {
        //   throw new Error(response.data.errors[0]);
        // }
        // const results: Array<Activity> = response;
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetQuickLinksQuery,
  useLoginMutation,
  useUploadMockupMutation,
  useCreateMockupMutation,
  useCreateAccountMutation,
  useForgotPasswordMutation,
  useGetMockupsByUserQuery,
  useGetMachinesQuery,
  useGetMachineTypesQuery,
  useDeleteMockupMutation,
  useUpdateMockupMutation,
  useGetMockupByIDQuery,
  useGetPresentationsByFolderQuery,
  useGetPresentationFoldersQuery,
  useGetFreestyleFoldersQuery,
  useGetTestimonialsQuery,
  useGetAllPresentationsQuery,
  useStrapiLoginMutation,
  useGetFoldersStrapiQuery,
  useGetFolderStrapiQuery,
  useGetMediaItemsQuery,
  useGetMeQuery,
  useUpdateMockupNameMutation,
  useUpdatePushTokensMutation,
  useGetActivitiesQuery,
  useGetUnreadActivitiesCountQuery,
} = wpApi;
