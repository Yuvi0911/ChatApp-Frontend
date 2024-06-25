/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */

import { Drawer, Grid, Skeleton } from "@mui/material";
import Title from "../shared/Title";
import ChatList from "../specific/Chatlist";
import Header from "./Header";
// import { sampleChats } from "../../constants/sampleData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import Profile from "../specific/Profile";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { useCallback, useEffect, useRef, useState } from "react";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";


const AppLayout = () => (WrappedComponent) => {
  
 return (props) =>{

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatId = params.chatId;
  const deleteMenuAnchor = useRef(null);

  const socket = getSocket();
  // console.log(socket.id)

  const [onlineUsers, setOnlineUsers] = useState([]);

  const {isMobile} = useSelector((state) => state.misc)
  const {user} = useSelector((state) => state.auth)
  const {newMessagesAlert} = useSelector((state) => state.chat)

  // eslint-disable-next-line no-unused-vars
  const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");
  //isLoading by default query provide krvata h jab tak data fetch hota h tab tak ye true hoga aur jaise hi data fetch ho jaiye ga toh ye false ho jaiye ga. Iska use kr k hum ternary operator k dvara bnaya gya loader show kr skte h jab tak data load ho rha h aur jaise hi data load ho jaiye ga toh hum component ko dikha dege.

  useErrors([{isError, error}]);

  useEffect(()=>{
    getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert});
  },[newMessagesAlert])
  
  // console.log(data);
  const handleDeleteChat = (e, chatId, groupChat) => {
    dispatch(setIsDeleteMenu(true));
    // e.preventDefault();
    dispatch(setSelectedDeleteChat({chatId, groupChat}));
    deleteMenuAnchor.current = e.currentTarget;
    // console.log("Delete Chat", _id, groupChat);
  };

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const newMessageAlertListener = useCallback((data)=>{
    //yadi humne vo chat open kr rhki h toh hume messages k alert nhi dikhane.
    if(data.chatId === chatId) return;
    dispatch(setNewMessagesAlert(data))
  },[chatId, dispatch]);

  const newRequestListener = useCallback(()=>{
    dispatch(incrementNotification());
  },[dispatch]);
 
  const refetchListener = useCallback(()=>{
    refetch();
    navigate("/");
  },[refetch, navigate]);

  const onlineUsersListener = useCallback((data)=>{
    setOnlineUsers(data);
  },[]);

  const eventHandlers = {
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
    [ONLINE_USERS]: onlineUsersListener,
  };

  //jo event server se emit hua h ushe listen krege ye.
  useSocketEvents(socket, eventHandlers);

    return (
        <>
          <Title/>
          <Header/>

            <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>
          {
            isLoading ? (<Skeleton/>) : (
              <Drawer open={isMobile} onClose={handleMobileClose}>
                <ChatList
                w="70vw"
                 chats={data?.chats}
                 chatId={chatId}
                 handleDeleteChat={handleDeleteChat}
                 newMessagesAlert={newMessagesAlert}
                 onlineUsers={onlineUsers}
                 />
              </Drawer>
            )
          }

          <Grid container height = {"calc(100vh - 4rem)"}>
            <Grid item sm={4} md={3} sx={{
              display:{ xs:"none", sm: "block"},
            }} 
            height={"100%"} >
             {
              isLoading ? (<Skeleton/>) : (
                <ChatList 
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
              )
             }
              </Grid>

            <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} ><WrappedComponent {...props} chatId={chatId}   user={user}/></Grid>

            <Grid item md={4} lg={3} height={"100%"} sx={{
              display: { xs: "none", md:"block"},
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}>
              <Profile user={user}/>
              </Grid>
          </Grid>
        </>
      )
 }
}

export default AppLayout
//AppLayout ek high order function h jo ki dusre components ko as a argument/props leta h aur unme modification kr deta h aur jab hum app.jsx me <Route path="/" element = {<Home/>}/> ye line likh kr Home component ko call krege toh ye modified Home call hoga
// return (props) =>{
//   return (
//       <div>
//         <div>Header</div>
//         <WrappedComponent {...props}/>
//         <div>Footer</div>
//       </div>
//     )
// }
//WrappedComponent ki jagh vo component aa jaiye ga jo humne export krte time AppLayout()(argument/props) me as a argument pass kiya hoga.