import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as IoIcons from 'react-icons/io'
import * as faIcons from 'react-icons/fa'
import UserContext from '../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {jwtDecode} from 'jwt-decode'

function UsersList() {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const decoded = jwtDecode(user.accessToken);

    useEffect(() => {
        axios({method: 'GET', url: `${import.meta.env.VITE_URI}/register/getusers`}, {headers: { "Content-Type": "application/json" }})
            .then((res) => setUsers(res.data));
    },[]);

    const createChat = (userId) => {
        const decoded = jwtDecode(user.accessToken);
        axios.post(`${import.meta.env.VITE_URI}/chat`, {user1: decoded.user._id, user2: userId}, {headers: {"Content-Type": "application/json"}});
        navigate('/');
        toast.success('Chat created');
    };

    const addFriend = (userId) => {
        const decoded = jwtDecode(user.accessToken);
        axios.put(`${import.meta.env.VITE_URI}/register/${decoded.user._id}/addfriend`, {friendId: userId}, {headers: {"Content-Type": "application/json"}})
        .then((res) => {
            if(res.data =='ok'){
                toast.success('Friend added');
            } else if(res.data == 'added'){
                toast.error('Friend already added');
            };
        })
 
    };

  return (
    <section>
        <h1 className="register-title">Users</h1>
        <div className="user-container">
            <div className="search-user">
                <input type="text" onChange={(e) => {setSearch(e.target.value)}} placeholder='Search users'/>
            </div>
            <div className="users">
                {
                    users === false ? (<p>There are no users</p>):
                    users.filter((item) => {
                        return search.toLocaleLowerCase() === '' ? item : item.name.toLocaleLowerCase().includes(search);
                    }).map((res, key) => {
                        return (res._id !== decoded.user._id ?(<div className="user" key={key}>
                                <div className="user-info">
                                    <div className="img-container">
                                        <img className='user-img' src={res.profileImg.image} alt="user icon" />
                                    </div>
                                    <span>{res.name + " " + res.surname}</span>
                                </div>
                                
                                    <div className={`user-options`}>                                   
                                    <ul className='options-user'>
                                        <li onClick={() => addFriend(res._id)}><faIcons.FaUserFriends /></li>
                                        <li onClick={() => createChat(res._id)}><IoIcons.IoMdChatbubbles /></li>
                                    </ul>
                                </div>
                            </div>) : ''
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default UsersList