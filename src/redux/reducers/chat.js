import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessagesAlert: getOrSaveFromStorage({
    key:NEW_MESSAGE_ALERT, get:true}) || [
    {
      chatId: "",
      count: 0,
    }
  ]
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
      incrementNotification: (state) => {
        state.notificationCount +=  1;
      },
      resetNotificationCount: (state) => {
        state.notificationCount = 0;
      },

      //iski help se hum jab bhi koi user msg bheje ga dusre user ko toh dusre user k ui me message count ki value bdha dege.
      setNewMessagesAlert: (state, action) => {
        //jisne msg bheja h uski chat id le ge
        const chatId = action.payload.chatId;
        //newMessageAlert ki array me check kre ge ki vo id present h ya nhi. present hogi toh index ki value me us id ka index aa jaiye ga nhi toh -1 rhe ga.
        const index = state.newMessagesAlert.findIndex(
          (item) => item.chatId === chatId
        );

        //yadi id present h toh naya msg bhi same user ne bheja h isliye keval count ki value bdha dege.
        if(index !== -1){
          state.newMessagesAlert[index].count += 1;
        }
        //id present nhi h toh newMessageAlert ki array me chatId aur count push krdege
        else{
          state.newMessagesAlert.push({
            chatId,
            count: 1
          })
        }
      },

      removeNewMessagesAlert: (state, action) => {
        state.newMessagesAlert = state.newMessagesAlert.filter(
          (item)=> item.chatId !== action.payload
        )
      }

    }
});

export default chatSlice;
export const {
 incrementNotification, resetNotificationCount,
 setNewMessagesAlert,
 removeNewMessagesAlert
} = chatSlice.actions;