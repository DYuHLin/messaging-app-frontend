import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import UserContext from '../Context/UserContext'
import * as IoIcons from 'react-icons/io'
import {jwtDecode} from 'jwt-decode'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Chats() {
    const [chats, setChats] = useState(false);
    const [search, setSearch] = useState('');
    const [hidden, setHidden] = useState('hidden');
    const [chat, setChat] = useState(false);
    const { user } = useContext(UserContext);
    const decoded = jwtDecode(user.accessToken);
  
    useEffect(() => {
            axios({method: "GET", url: `${import.meta.env.VITE_URI}/chat/${decoded.user._id}`}, {headers: {"Content-Type": "application/json"}})
            .then(res => setChats(res.data)
            ).catch(err => console.log(err));  
      },[]);

      const showDelete = (id) => {
        setHidden('');
        setChat(id);
      };

      const deleteChat = () => {
        try{
          axios.delete(`${import.meta.env.VITE_URI}/chat/${chat}`, {headers: { "Content-Type": "application/json" }});
            toast.success("You have deleted this chat successfully");
            setHidden('hidden');
            setChat(false);
            setChats(chats.filter((item) => chat !== item._id))
        }catch(err){
          console.log(err);
        }
      };

  return (
    <section>
        <h1 className="register-title">Chats and group chats</h1>
        <div className="user-container">
          <h3>Chats</h3>
            <div className="search-user">
                <input type="text" onChange={(e) => {setSearch(e.target.value)}} placeholder='Search chats'/>
            </div>
            <div className={`delete-chat ${hidden}`}>
              <p>Are you sure you want to delete this chat?</p>
              <div className="btn-group">
                <button className="delete" onClick={deleteChat}>Delete</button>
                <button className="cancel" onClick={() => setHidden('hidden')}>Cancel</button>
              </div>
            </div>
            <div className="users">
                {
                chats === false ? (<p>There are no chats</p>):
                chats.filter((item) => {
                  return search.toLocaleLowerCase() === '' ? item : item.members[0].user.name.toLocaleLowerCase().includes(search) || item.members[1].user.name.toLocaleLowerCase().includes(search);
                }).map((chat, id) => {
                  return(
                    chat.members.map((member) => {
                      return (
                      member.user._id !== decoded.user._id ? (
                          <div className={`user`} key={id}>
                              <div className="user-info">
                                  <div className="img-container">
                                      <img className='user-img' src={member.user.profileImg.image} alt="user icon" /> 
                                  </div>
                                  <span>{member.user.name + " " + member.user.surname}</span>
                              </div>
                              <div className="user-options">
                                <ul className='options-user'>
                                  <li onClick={() => showDelete(chat._id)}><IoIcons.IoMdRemoveCircle /></li> 
                                </ul> 
                              </div>                               
                          </div>) : ''
                      )
                  }) 
                )
              })
              }
          </div>
      </div>
    </section>
  )
}

export default Chats