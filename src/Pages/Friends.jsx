import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import * as IoIcons from 'react-icons/io'
import UserContext from '../Context/UserContext'
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Friends() {
  const { user } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [friends, setFriends] = useState(false);
    const navigate = useNavigate();
    const decodedUser = jwtDecode(user.accessToken);

    const createChat = (userId) => {
        const decoded = jwtDecode(user.accessToken);
        axios.post(`${import.meta.env.VITE_URI}/chat`, {user1: decoded.user._id, user2: userId}, {headers: {"Content-Type": "application/json"}});
        navigate('/');
        toast.success('Chat created');
    };

    const removeFriend = (userId) => {
        axios.put(`${import.meta.env.VITE_URI}/register/${decodedUser.user._id}/deletefriend`, {friendId: userId}, {headers: {"Content-Type": "application/json"}});
        navigate('/');
        toast.success('Friend removed');
    };

    useEffect(() => {
        axios({method: 'GET', url: `${import.meta.env.VITE_URI}/register/${decodedUser.user._id}/getuser`}, {headers: { "Content-Type": "application/json" }})
            .then((res) => setFriends(res.data.friends));
    }, [friends]);

  return (
    <section>
        <h1 className="register-title">Friends</h1>
        <div className="user-container">
            <div className="search-user">
                <input type="text" onChange={(e) => {setSearch(e.target.value)}} placeholder='Search friends'/>
            </div>
            <div className="users">
                {
                  friends === false ? (<p>There are no friends</p>):
                  friends < 0 ? (<p>There are no friends</p>):
                  friends.filter((item) => {
                    return search.toLocaleLowerCase() === '' ? item : item.user.name.toLocaleLowerCase().includes(search);
                    }).map((res, key) => {
                        return (
                            <div className="user" key={key}>
                                <div className="user-info">
                                    <div className="img-container">
                                        <img className='user-img' src={res.user.profileImg.image} alt="user icon" />
                                    </div>
                                    <div className="friend-info">
                                        <span>{res.user.name + " " + res.user.surname}</span>
                                        <span className='chat-message'>{res.user.online == false ? 'Offline' : 'Online'}</span>
                                    </div>               
                                </div>
                                
                                    <div className={`user-options`}>                                   
                                    <ul className='options-user'>
                                        <li onClick={() => removeFriend(res.user._id)}><IoIcons.IoMdRemoveCircle /></li>
                                        <li onClick={() => createChat(res.user._id)}><IoIcons.IoMdChatbubbles /></li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default Friends