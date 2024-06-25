/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */

import { useCallback, useEffect, useRef, useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import { IconButton, Skeleton, Stack } from "@mui/material"
import { grayColor, orange } from "../constants/color"
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material"
import { InputBox } from "../components/styles/StyledComponents"
import FileMenu from "../components/dialogs/FileMenu"
// import { sampleMessage } from "../constants/sampleData"
import MessageComponent from "../components/shared/MessageComponent"
import { getSocket } from "../socket"
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events"
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api"
import { useErrors, useSocketEvents } from "../hooks/hook";

import { useInfiniteScrollTop } from "6pp"
import { useDispatch } from "react-redux"
import { setIsFileMenu } from "../redux/reducers/misc"
import { removeNewMessagesAlert } from "../redux/reducers/chat"
import { TypingLoader } from "../components/layout/Loaders"
import { useNavigate } from "react-router-dom"

// const user = {
//   _id: "asdfghjkl",
//   name: "Yuvraj Rajput",
// }

const Chat = ({chatId, user}) => {
  // console.log(chatId)
  const containerRef = useRef(null);
  const bottomRef = useRef(null);


  //socket ko use krne k liye h ye line.
  const socket = getSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  //messages ki array hogi jisme sbhi messages store hoge jo hum dusre user ko bheje ge
  const [messages, setMessages] = useState([]);
  // console.log(messages);
  const [page, setPage] = useState(1);

  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  //skip ka matlab h ki chat id h toh ye call hoga aur yadi chat id nhi h toh ye call nhi hoga.
  const chatDetails = useChatDetailsQuery({chatId, skip: !chatId})

  //page reload krne pr purane message chle na jaye isliye unko database se fetch kr k show kre ge.
  const oldMessagesChunk = useGetMessagesQuery({chatId, page});
  // console.log("oldMessagesChunk ",oldMessagesChunk.data?.totalPages)

  //iski help se hum infinite scroll bar use kre jab bhi scroll bar top par chla jaiye ga toh naya data load ho jaye ga.
  const {data: oldMessages, setData: setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  )

  const errors =[
    {isError:chatDetails.isError, error:chatDetails.error},
    {isError:oldMessagesChunk.isError, error:oldMessagesChunk.error},
  ];

  // console.log("oldMessages ",oldMessages.data)
  
  // console.log(chatDetails.data.chat.members);
  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e)=>{
    setMessage(e.target.value);

    if(!IamTyping){
      socket.emit(START_TYPING, {members, chatId});
      setIamTyping(true);
    }

    //jab tak m type krta rhu ga tab tak start type vala listener chlta rhe ga aur jab type krna band krdu ga uske 2 sec k baad stop typing vala listener aa jaiye ga. yadi m 2 sec hone se phle type kr deta hu toh time dubara clear ho kr 0 sec ho jaiye ga.
    if(typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(()=>{
      socket.emit(STOP_TYPING, {members, chatId});
      setIamTyping(false);
    }, [2000]);
  }

  const handleFileOpen = (e) =>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(message);

    if(!message.trim()) return;

    //Emitting message to the server
    socket.emit(NEW_MESSAGE, {chatId, members, message});

    setMessage("");

  }

  //is useEffect ki help se hum jab ek user se dusre user ki chat dekhe toh bina reload kiye us dusri chat k messages show hoge na ki purani vali chat k message show hoge.
  useEffect(()=>{

    socket.emit(CHAT_JOINED, {userId: user._id, members})

    dispatch(removeNewMessagesAlert(chatId))

    // ye sbhi humne clean up function me isliye likhe h kyoki hum nhi chahte ki phli baar ye mount ho tab bhi ye cheje execute ho. return () ye 1 clean up function h jo ki dusri baar me execute hoga jab id change hone pr useEffect dobara mount hoga. Jaise hi id change hogi toh state me se purane data ko hta dega ye aur component re render hoga tab vo database se us id k message le aaye ga.
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, {userId: user._id, members})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chatId])

  useEffect(() => {
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behaviour: "smooth"});
  },[messages]);

  useEffect(() => {
    if(chatDetails.isError) return navigate("/")
  }, [chatDetails.isError, navigate])

  //jo bhi naya message bheje ge vo purane messages ki array me add ho jaiye ga.
  const newMessageListener = useCallback((data) => {
    // console.log(data);
    //yadi parameter vali id aur user ki id alag alag h toh message append nhi krna.
    if(data.chatId !== chatId) return;

    setMessages((prev) => [...prev, data.message])

  },[chatId]);
  
  // useEffect(()=>{
    //hume baar naye handler k liye same line of code ko repeat krna pdta isliye humne hooks file me 1 function bna liye jisme loop lga kr value pass kr dege.
    //   socket.on(NEW_MESSAGE,(data)=>{
      //     console.log(data);
      //   });
      
      //   return () => {
        //     socket.off(NEW_MESSAGE, newMessageListener);
        //   }
        // // eslint-disable-next-line react-hooks/exhaustive-deps
        // },[]);

        
        //is listener ki help se hum pta chal jaiye ga ki sender kuch type kr rha h.
        const startTypingListener = useCallback((data) => {
          // console.log(data);
          //yadi parameter vali id aur user ki id alag alag h toh return krdege.
          if(data.chatId !== chatId) return;
      
          // console.log("start - typing",data);

          setUserTyping(true);
      
        },[chatId]);
    
        //is listener ki help se hum pta chal jaiye ga ki sender kuch type kr rha h.
        const stopTypingListener = useCallback((data) => {
          // console.log(data);
          //yadi parameter vali id aur user ki id alag alag h toh return krdege.
          if(data.chatId !== chatId) return;
      
          // console.log("stop - typing",data);

          setUserTyping(false);
      
        },[chatId]);

        const alertListener = useCallback(
          (data) => {
            if(data.chatId !== chatId) return;
          const messageForAlert = {
            content: data.message,
            sender: {
                _id: "666ec669b4a7ad0bed16a2ae",
                name: "Admin",
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev)=> [...prev, messageForAlert])
        },[chatId]);


  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  //jo event server se emit hua h ushe listen krege ye.
  useSocketEvents(socket, eventHandlers);

  //yadi koi error aata h toh.
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (<Skeleton/>) : (
    <>
      <Stack 
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        {
          allMessages.map((i)=>(
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }
        {
          userTyping && <TypingLoader/>
        }

        <div ref={bottomRef}/>
        </Stack>

        <form 
          style={{
            height: "10%"
          }}
          onSubmit={submitHandler}
        >
          <Stack 
            direction={"row"}  height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          > 
            <IconButton 
              sx={{
                position: "absolute",
                left: "1.5rem",
                rotate: "30deg",
              }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon/>
            </IconButton>

            <InputBox placeholder="Type Message Here..."
            value={message} 
            onChange={messageOnChange}
            />

            <IconButton     
              type="submit"
              sx={{
                rotate: "-30deg",
                bgcolor: orange,
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem",
                "&:hover": {
                  bgcolor: "error.dark"
                }
              }}
            >
              <SendIcon/>
            </IconButton>
          </Stack>
        </form>

        <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat)
