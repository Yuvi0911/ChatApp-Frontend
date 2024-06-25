export const sampleChats = [{
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Yuvraj",
    _id: "1",
    groupChat: false,
    members: ["1","2"],
},
{
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Yuvi",
    _id: "2",
    groupChat: false,
    members: ["1","2"],
},
]

export const sampleUsers = [
    {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Yuvraj",
        _id: "1",
    },
    {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Yuvi",
        _id: "2",
    }
]

export const sampleNotifications = [
    {
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Yuvraj",
        },
            _id: "1",
        },
        {
            sender: {
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "Yuvi",
            },
            _id: "2",
        }
]

export const sampleMessage = [
    {
        attachments: [
        ],
        content: "This is my message",
        _id: "asdfghjklqwert",
        sender:{
            _id: "user._id",
            name: "Yuvraj",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },
    {
        attachments: [
            {
                public_id: "asdsad 2",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            }
        ],
        content: "",
        _id: "asdfghjklqwerter",
        sender:{
            _id: "asdfghjkl",
            name: "Yuvraj 2",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    }
];

export const dashboardData = {
    users: [
        {
            name: "Yuvraj",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "1",
            username: "yuvraj",
            friends: 20,
            groups: 5,
        },
        {
            name: "Yuvi",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            _id: "2",
            username: "yuvi",
            friends: 10,
            groups: 3,
        }
    ],
    chats: [
    {
        name: "Group1",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: "1",
        goupChat: false,
        members: [
            {_id:"1",avatar:"https://www.w3schools.com/howto/img_avatar.png"},
            {_id:"2",avatar:"https://www.w3schools.com/howto/img_avatar.png"}
        ],
        totalMembers: 2,
        totalMessages: 50,
        creator:{
            name:"Yuvraj",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
        }
    },
    {
        name: "Group2",
        avatar:[ "https://www.w3schools.com/howto/img_avatar.png"],
        _id: "2",
        goupChat: true,
        members: [
            {_id:"1",avatar:"https://www.w3schools.com/howto/img_avatar.png"},
            {_id:"2",avatar:"https://www.w3schools.com/howto/img_avatar.png"}
        ],
        totalMembers: 2,
        totalMessages: 10,
        creator:{
            name:"Yuvraj",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
        }
        },
    ],

    messages:[
        {
            attachments: [
            ],
            content: "This is my message",
            _id: "asdfghjklqwert",
            sender:{
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "Yuvraj",
            },
            chat: "chatId",
            groupChat: false,
            createdAt: "2024-02-12T10:41:30.630Z",
        },
        {
            attachments: [
                {
                    public_id: "asdsad 2",
                    url: "https://www.w3schools.com/howto/img_avatar.png",
                }
            ],
            content: "",
            _id: "asdfghjklqwerter",
            sender:{
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "Yuvraj 2",
            },
            chat: "chatId",
            groupChat: true,
            createdAt: "2024-02-12T10:41:30.630Z",
        }
    ]

}
