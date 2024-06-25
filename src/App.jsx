import {BrowserRouter, Routes, Route } from "react-router-dom";
import {Suspense, lazy, useEffect} from "react";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from 'axios';
import { server } from "./constants/config";
import {useDispatch, useSelector} from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import {Toaster} from "react-hot-toast";
import { SocketProvider } from "./socket";

//yadi hum default behaviour se import krte h toh ye static loading krta h pages k data ki. Iska matlab ye h ki jab hum website pr jaiye ge toh sbhi pages ka data lad ho jaiye ga server se.
// import Home from "./pages/home";

//lazy function se hum dynamic loading kr skte h page k data ki. Iska matlab h ki hum jis page pr jaiye ge keval us page k data ko load krege server se.  
const Home = lazy(()=>import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
// import Chat from "./pages/Chat";
const Chat = lazy(()=>import("./pages/Chat"))
// import Groups from "./pages/Groups";
const Groups = lazy(()=>import("./pages/Groups"))
// import NotFound from "./pages/NotFound";
const NotFound = lazy(()=>import("./pages/NotFound"))
// import AdminLogin from "./pages/admin/AdminLogin";
const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"))
// import Dashboard from "./pages/admin/Dashboard";
const Dashboard = lazy(()=>import("./pages/admin/Dashboard"))
const UserManagement = lazy(()=>import("./pages/admin/UserManagement"))
const ChatManagement = lazy(()=>import("./pages/admin/ChatManagement"))
const MessagesManagement = lazy(()=>import("./pages/admin/MessageManagement"))

// let user = true;

const App = () => {

  const {user, loader} = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{

    // console.log(server);
    //jaha jaha hume header bhejne h vha withCredential true kru ga.
   axios.get(`${server}/api/v1/user/me`, {withCredentials: true})
   .then(({data})=>{
    // console.log(data.user)
    dispatch(userExists(data.user))
   })
   .catch(()=> dispatch(userNotExists()));
  },[dispatch])

  return loader ? (
    <LayoutLoader/>
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader/>}>
      <Routes>
      <Route element={
        <SocketProvider>
        <ProtectRoute user={user}/>
      </SocketProvider>
    }>
        <Route path="/" element = {<Home/>}/>
        <Route path="/chat/:chatId" element = {<Chat/>}/>
        <Route path="/groups" element = {<Groups/>}/>
      </Route>

        <Route path="/login" element = {
          <ProtectRoute user={!user} redirect="/">
            <Login/>
          </ProtectRoute>
        }/>

        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/users" element={<UserManagement/>}/>
        <Route path="/admin/chats" element={<ChatManagement/>}/>
        <Route path="/admin/messages" element={<MessagesManagement/>}/>

        {/* kuch bhi galat url dete h toh not found page pr chle jaiye ge */}
        <Route path="*" element={<NotFound/>}/>

      </Routes>
      </Suspense>
      <Toaster position="bottom-center"/>
    </BrowserRouter>
  )
}

export default App

// JavaScript में ?. को ऑप्शनल चेनिंग ऑपरेटर (Optional Chaining Operator) कहते हैं। यह ऑपरेटर हमें उन cases में errors से बचाता है जब किसी property या object undefined या null हो। जब आप data.friends लिखते हैं और data undefined या null होता है, तो JavaScript एक error फेंकता है क्योंकि वो friends property को access करने की कोशिश करता है जो कि undefined या null object पर नहीं हो सकता। पर जब आप data?.friends लिखते हैं, तो अगर data undefined या null होता है, तो वो simply undefined return करता है बजाय error फेंकने के। यह ऑपरेटर यह चेक करता है कि data defined है या नहीं और अगर defined है तो ही friends property को access करता है।
    // console.log(data?.friends);