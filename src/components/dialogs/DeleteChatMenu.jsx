/* eslint-disable react/prop-types */
import { Menu, Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../redux/api/api";
import { useEffect } from "react";

const DeleteChatMenu = ({dispatch, deleteMenuAnchor}) => {
    const navigate = useNavigate();

    const {isDeleteMenu, selectedDeleteChat} = useSelector((state)=> state.misc);
    // console.log(selectedDeleteChat)

    // eslint-disable-next-line no-unused-vars
    const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)
   
    // eslint-disable-next-line no-unused-vars
    const [leaveGroup,__,leaveGrouptData] = useAsyncMutation(useLeaveGroupMutation)

    const isGroup = selectedDeleteChat.groupChat;

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    };

    const leaveGroupHandler =() => {
        closeHandler();
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
    };

    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
    };

    useEffect(() => {
        if(deleteChatData || leaveGrouptData) navigate("/");
    }, [deleteChatData, leaveGrouptData, navigate]);

  return (
    <Menu
        open={isDeleteMenu} 
        onClose={closeHandler} 
        anchorEl={deleteMenuAnchor.current}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}   
        transformOrigin={{
            vertical: "center",
            horizontal: "center"
        }} 
    >
        <Stack 
            sx={{
                width: "10rem",
                padding: "0.5rem",
                cursor: "pointer",
            }}    
            direction={"row"}
            alignItems={"center"}
            spacing={"0.5rem"}
            onClick = {isGroup ? leaveGroupHandler : deleteChatHandler}
        >
            {
                isGroup ? 
                <>
                    <ExitToAppIcon/>
                    <Typography>Leave Group</Typography>
                </> 
                : 
                <>
                    <DeleteIcon/>
                    <Typography>Delete Chat</Typography>
                </>
            }
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu
