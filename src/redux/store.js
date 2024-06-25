import { configureStore} from "@reduxjs/toolkit"
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";

const store = configureStore({
    reducer: {
        //hum directly reducer ka name auth bhi likh skte h [authSlice.name] ki jagah leki fir yadi hum vha pr name change krege toh hume yha bhi change krna pdega
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    //middleware ek function h jo ki middleware ki array return krta h.
    middleware:(defaultMiddleware)=> [...defaultMiddleware(),api.middleware],
})

export default store;