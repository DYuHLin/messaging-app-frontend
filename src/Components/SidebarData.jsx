import * as faIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import React from 'react'

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icons: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Chats',
        path: '/chats',
        icons: <IoIcons.IoMdChatboxes />,
        cName: 'nav-text'
    },
    {
        title: 'Users',
        path: '/users',
        icons: <faIcons.FaUser />,
        cName: 'nav-text'
    },
    {
        title: 'Friends',
        path: '/friends',
        icons: <faIcons.FaUserFriends />,
        cName: 'nav-text'
    },
    {
        title: 'Groups',
        path: '/groups',
        icons: <faIcons.FaLayerGroup/>,
        cName: 'nav-text'
    },
    {
        title: 'Profile',
        path: '/yourprofile',
        icons: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
]