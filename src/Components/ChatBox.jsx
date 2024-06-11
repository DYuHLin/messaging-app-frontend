import React, { useContext, useEffect, useState, useRef } from 'react'
import UserContext from '../Context/UserContext'
import SendMessage from './SendMessage'
import * as RiIcons from 'react-icons/ri'
import {jwtDecode} from 'jwt-decode'

function ChatBox({socket}) {
  const { user, messages, setMessages, name, setValid, setChat, valid, online } = useContext(UserContext);
  const [msg, setMsg] = useState('');
  const decodedUser = jwtDecode(user.accessToken);
  const lastMessage = useRef(null);

  useEffect(() => {
    socket.off('receive_message').on('receive_message', (data) => {
      setMessages((content) => [...content, data.message]);
    });
  },[socket]);

  useEffect(() => {
    lastMessage.current?.scrollIntoView();
  }, [messages]);

  const backChats = () => {
    setValid('invalid');
    setChat(false);
  };

  return (
    <div className={`chat-box ${valid == 'invalid' ? 'hidden' : ''}`}>
      <div className="chat-header">
        <RiIcons.RiArrowLeftDoubleFill className='menu-bars' onClick={backChats}/>
        <div className="chat-member-info">
          <h3 className='box-title'>{name}</h3>
          <span className="chat-message">{online == false ? 'Offline' : 'Online'}</span>
        </div>
      </div>
        <div className="messages">
          {messages.map((msg, index) => {
            return(
              <div className={`msg ${decodedUser.user._id == msg.user._id || decodedUser.user._id == msg.user ? 'you' : 'other'}`} key={index}>
                <div className="msg-info">

                  <div className={`msg-bubble ${decodedUser.user._id == msg.user._id || decodedUser.user._id == msg.user  ? 'you-bubble' : 'other-bubble'}`} >
                    <span className="msg-name">{decodedUser.user._id == msg.user._id || decodedUser.user._id == msg.user ? 'You' : msg.user.name + ' ' + msg.user.surname}</span>
                    {
                      msg.content.trim() != '' ? <div className="msg-content">{msg.content}</div> : ''
                    }
                    {
                      msg.image.trim() != '' ? <img className="msg-img" src={msg.image}/> : ''
                    }
                    {
                      msg.video.trim() != '' ? <a className="msg-img" href={msg.video}>{msg.video}</a>: ''
                    }
                  </div>
                  <span className="msg-time">{new Date(msg.date).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span> 
                </div>  
              </div>           
            )
          })}
          <div ref={lastMessage}/>
        </div>
        <SendMessage socket={socket}/>
    </div>
  )
}

export default ChatBox