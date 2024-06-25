import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from "@mui/material"
import {useInputValidation} from "6pp";
import {Search as SearchIcon} from '@mui/icons-material'
import UserItem from "../shared/UserItem";
import { useEffect, useState } from "react";
// import { sampleUsers } from "../../constants/sampleData";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
// import toast from "react-hot-toast";
import { useAsyncMutation } from "../../hooks/hook";


const Search = () => {

  const {isSearch} = useSelector(state => state.misc);

  //searchUser function ki help se hum search functionality me users ko find krege
  const [searhUser] = useLazySearchUserQuery();

  //isme likha gya code hume aur bhi jagah use krna tha toh  isliye hum 1 hi hook bna lege aur ushe dusri jagah bhi call kr lege.
  // const [sendFriendRequest] = useSendFriendRequestMutation();

  // humne useAsyncMutation 1 hook bna lie jisme hum aur hook pass kr skte h jinka code same h. Ye array return krege jisme first index pr function hoga, 2nd index pr isLoading aur 3rrd index pr data hoga isliye hum bhi same indexing k saath array ko accept krege lekin array k element ka naam kuch bhi le skte h
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const dispatch = useDispatch();

  const search = useInputValidation("");

  // let isLoadingSendFriendRequest = false;

  // eslint-disable-next-line no-unused-vars
  // const [users, setUsers] = useState(sampleUsers)
  const [users, setUsers] = useState([])

  const addFriendHandler = async(id) => {
    // console.log(id);
    // try {
    //   const res = await sendFriendRequest({userId: id});
    //   console.log(res);
    //   if(res.data){
    //     toast.success(res.data.message);
    //     // console.log(res.data);
    //   }
    //   else{
    //     // console.log(res.error.data.message);
    //     toast.error(res?.error?.data?.message || "Something went wrong");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Something went wrong")
    // }

    sendFriendRequest("Sending friend request...", {userId: id});
  }

  //search vale box k alava khi aur click krege toh ushe close krdega.
  const searchCloseHandler = () => dispatch(setIsSearch(false)) 

  useEffect(() => {
    //jab bhi hum user search krne k liye letter likhe ge toh useEffect execute hota rhe ga aur value ko search krta rhe ga.
    // console.log("search.value", search.value);

    //isliye hum setTimeout function ko use krege, iski vjah se jab hum likhna band kr dege uske 1 second k baad value ko search krega. Isme sbse phle return function execute hoga jo ki jab hum koi letter likhe ge toh time ko vapis se 0 kr dega.

    const timeOutId = setTimeout(()=>{
    searhUser(search.value)
    .then(({data})=>setUsers(data.users))
    .catch((e)=>console.log(e))
    },1000);

    return () => {
      clearTimeout(timeOutId);
    }
  },[search.value, searhUser]);
//[search.value, searchUser] => search.value ya searchUser jab bhi change hogi toh useEffect execute hoga.

  return <Dialog open={isSearch} onClose={searchCloseHandler}>
    <Stack padding={"2rem"}direction={"column"} width={"25rem"}>
      <DialogTitle textAlign={"center"}>Find People</DialogTitle>
      <TextField 
        label="" 
        value={search.value} 
        onChange={search.changeHandler}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment:(
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          )
        }}
      />

      <List>
       {
        users.map((i)=>(
          <UserItem 
            user={i}
            key={i._id}
            handler={addFriendHandler}
            handleIsLoading={isLoadingSendFriendRequest}
            />
        ))}
      </List>
    </Stack>
  </Dialog>
}

export default Search
