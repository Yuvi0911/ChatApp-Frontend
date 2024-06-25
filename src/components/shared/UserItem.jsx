/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import {Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material'
import { memo } from 'react'
import { transformImage } from '../../lib/features';

const UserItem = ({user, handler,handlerIsLoading, isAdded=false, styling={},}) => {

    // eslint-disable-next-line no-unused-vars
    const {name, _id, avatar} = user;
  return (
    // eslint-disable-next-line react/jsx-key
    <ListItem>
        <Stack 
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            width={"100%"}
            {...styling}
            >

            <Avatar src={transformImage(avatar)}/>

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
                {name}
            </Typography>
            <IconButton
                size='small'
                sx={{
                    bgcolor: isAdded ? "error.main" :"primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor: isAdded ? "error.dark" :"primary.dark"
                    },
                }}
                onClick={()=>handler(_id)} disabled={handlerIsLoading}>

                    {
                        isAdded ? <RemoveIcon/> : <AddIcon/>
                    }
                
            </IconButton>
        </Stack>
  </ListItem>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(UserItem)
