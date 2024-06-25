/* eslint-disable no-unused-vars */

import moment from "moment";

// is function ki help se hum check krege ki user ne kis type ka message bheja h aur us type k message k basics pr hum usse show krege 

const fileFormat = (url="") =>{
    const fileExt = url.split(".").pop();

    if(fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg"){
        return "video"; 
    }

    if(fileExt === "mp3" || fileExt === "wav"){
        return "audio"; 
    }

    if(fileExt === "png" || fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif"){
        return "image"; 
    }

    return "file";
}

//hum url me /dpr_auto/w_200 add kr dege jis se cloudinary image k size ko manage krdega. Is case me image ka size 200px hoga.
const transformImage = (url= "", width=100
)=>{
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return newUrl;
    // return url
};

const getLast7Days = () => {
    const currentDate = moment();

    const last7Days = [];

    for(let i = 0; i< 7; i++){
        const dayDate = currentDate.clone().subtract(i,"days");
        const dayName = dayDate.format("dddd");
        last7Days.unshift(dayName);
    }

    return last7Days;

};

const getOrSaveFromStorage = ({key, value, get}) => {
    if(get) return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;

    else localStorage.setItem(key, JSON.stringify(value));
}

export {fileFormat, transformImage, getLast7Days, getOrSaveFromStorage};