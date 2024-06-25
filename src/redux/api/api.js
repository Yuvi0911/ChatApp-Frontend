import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config';

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl:`${server}/api/v1/`
    }),
    tagTypes: ["Chat", "User", "Message"],
    endpoints:(builder)=>({
        myChats: builder.query({
            query:()=>({
                url: "chat/my",
                credentials: "include",
            }),
            //query me hum server se data lete h toh providesTags dete h kyoki ek baar page pr data aa gya toh vo cache me store hoga aur jab hume dubara same data chaiye ga toh hum dubara database se data nhi lege yadi us data me kuch updation ya change nhi hua hoga hum directly cache me se data le lege. Ye tags caching aur data consistency ke liye use hote hain.
            providesTags: ["Chat"]
        }),

        searchUser:builder.query({
            query: (name) =>({
             url: `user/search?name=${name}`,
             credentials:"include",
            }),
            providesTags: ["User"]
        }),

        sendFriendRequest: builder.mutation({
            query:(data)=>({
                url: "user/sendrequest",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        getNotification: builder.query({
            query: () => ({
                url: `user/notifications`,
                credentials: "include",
            }),
            //jab hume caching nhi keni hoti toh hum ye likhte h
            keepUnusedDataFor: 0,
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "user/acceptrequest",
                method: "PUT",
                credentials:"include",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),

        chatDetails: builder.query({
            query: ({chatId, populate=false}) => {
                let url = `chat/${chatId}`;
                if(populate) url += "?populate=true"

                return {
                    url,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"],
        }),

        getMessages: builder.query({
            query: ({ chatId, page}) => ({
                url: `chat/message/${chatId}?page=${page}`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),
   
        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "chat/message",
                method: "POST",
                credentials: "include",
                body: data,
            })
        }),

        myGroups: builder.query({
            query: () => ({
                url: "chat/my/groups",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),

        availableFriends: builder.query({
            query: (chatId) => {
               let url = `user/friends`;
               if(chatId) url += `?chatId=${chatId}`;
               
               return {
                url,
                credentials: "include",
               };
            },
            providesTags: ["Chat"],
        }),

        newGroup: builder.mutation({
            query: ({name ,members}) => ({
                url: "chat/new",
                method: "POST",
                credentials: "include",
                body: {name,members},
            }),
            invalidatesTags: ["Chat"],
        }),
        
        renameGroup: builder.mutation({
            query: ({chatId, name}) => ({
                url: `chat/${chatId}`,
                method: "PUT",
                credentials: "include",
                body: {name},
            }),
            invalidatesTags: ["Chat"],
        }),

        removeGroupMember: builder.mutation({
            query: ({ chatId, userId }) => ({
                url: "chat/removemember",
                method: "PUT",
                credentials: "include",
                body: { chatId, userId }
            }),
            invalidatesTags: ["Chat"],
        }),
      
        addGroupMembers: builder.mutation({
            query: ({ members, chatId }) => ({
                url: "chat/addmembers",
                method: "PUT",
                credentials: "include",
                body: { members, chatId }
            }),
            invalidatesTags: ["Chat"],
        }),

        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
      
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leave/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),

    })
});



export default api;   

//use vala apne aap call ho jata h jab component mount hota h aur useLazy vale ko call krne k liye hume triger bnana pdta h.
export const {useMyChatsQuery,
    useLazySearchUserQuery, 
    useSendFriendRequestMutation, 
    useGetNotificationQuery, 
    useAcceptFriendRequestMutation,
    useChatDetailsQuery, 
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMembersMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation
} = api;

  //mutation me hum server me data dete h toh hum invalidateTags ka use krte h jo ki cache k data ko remove krdeta h aur related data ko fresh fetch krta h.
// invalidateTags: ["Chat"]