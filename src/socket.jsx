/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable react/prop-types */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react-hooks/rules-of-hooks */
// import { createContext, useContext, useMemo } from "react";
// import {io} from "socket.io-client";


// const SocketContext = createContext();

// //yadi m kisi bhi component k andar getSocket() function ko call kruga toh mujhe socket mil jaye ga.
// const getSocket = () => useContext(SocketContext);

// //hum jis bhi component me socket ko use krna hoga un component ko hum SoketProvider me wrap krdege.
// const SocketProvider = ({children}) => {

//     //hum baar baar re rendering pr socket ko localhost se connect nhi krna chahte keval ek baar hi connect kre ge isliye hum ishe useMemo me wrap krdege.
//     //useMemo ka use kr k hum isko re rendering k time dubara execute hone se rok skte h. Isme likha code tbhi dubara execute hoga jab dependency array ([]) me di gyi value change hogi.
//     const socket = useMemo(
//         () => io("http://localhost:3000",{
//             withCredentials: true
//         }),[]
//     );
    
//     return (
//         //hume jab bhi socketProvider ko use krna hoga toh hum ushe aise likhe ge <SocketProvider> iske ander jo bhi likhe ge vo children ki trh paas hoga </SocketProvider>
//         <SocketContext.Provider value={socket}>
//             {children}
//         </SocketContext.Provider>
//     )
// }

// // export { SocketProvider, getSocket}

import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };