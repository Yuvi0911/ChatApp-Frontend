/* eslint-disable react/prop-types */
import {Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography} from "@mui/material";
// import { sampleNotifications } from "../../constants/sampleData";
import { memo } from "react";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {

  const {isNotification} = useSelector((state)=>state.misc);

  const dispatch = useDispatch();

  const {isLoading, data, error, isError} = useGetNotificationQuery();

  //m kisi bhi naam se le skta hu acceptFriendRequest function ko. Maine acceptRequest naam se le liya.
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);


  const  friendRequestHandler = async ({_id, accept}) => {
    // console.log(_id);
    // console.log(accept);

    dispatch(setIsNotification(false));

    //yadi hum useAsyncMutation(jo ki humne 1 common hook bna liya) me wrap krte h toh hume keval ye line likhni h aur yadi hum ye nhi likhte h toh try-catch block use krege.
    await acceptRequest("Accepting...",{requestId: _id, accept});
    // try {
    //   const res = await acceptRequest({requestId: _id, accept});
    //   if(res.data?.success) {
    //     console.log("Use Socket Here");
    //     toast.success(res.data.message);
    //   }
    //   else{
    //     toast.error(res.data?.error || "Something went wrong")
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong");
    // }
  }

  const closeHandler = () => dispatch(setIsNotification(false))

  useErrors([{error, isError}]);
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs: "1rem", sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifiactions</DialogTitle>
        {
          isLoading ? 
          (<Skeleton/>) :
          (
            <>
              {
          data?.allRequests.length > 0 ? (
            data?.allRequests?.map(({sender, _id})=> (
              <NotificationItem
                sender={sender}
                _id={_id} 
                handler={friendRequestHandler}
                key={_id}/>))
          ) : <Typography textAlign={"center"}>O notifications</Typography>
        }
            </>
          )

        }
      </Stack>
    </Dialog>
  )
}

// eslint-disable-next-line react/display-name
const NotificationItem = memo(({sender, _id, handler}) =>{

  const {name, avatar} = sender;
  return (
    <ListItem>
        <Stack 
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            width={"100%"}
            >
            <Avatar src={avatar}/>
            <Typography
                variant='body1'
                sx={{
                    flexGrow: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%"
                }}
            >
                {`${name} sent you a friend request`}
            </Typography>
            <Stack 
              direction={{
                xs: "column",
                sm: "row",
              }}
              >
              <Button onClick={()=>handler({_id, accept:true})}>Accept</Button>
              <Button color="error" onClick={()=>handler({_id, accept:false})}>Reject</Button>
            </Stack>
        </Stack>
  </ListItem>
  )
})
export default Notifications
