import React, { useContext, useEffect, useRef, useState } from 'react'
import * as faIcons from 'react-icons/fa'
import * as IoIcons from 'react-icons/io'
import axios from 'axios'
import UserContext from '../Context/UserContext'
import { jwtDecode } from 'jwt-decode'
import Emoji from './Emoji'

function SendMessage({socket}) {
    const [link, setLink] = useState('');
    const [content, setContent] = useState('');
    const [options, setOptions] = useState(false);
    const [image, setImage] = useState('');
    const [hidden, setHidden] = useState('hidden');
    const [hide, setHide] = useState('');
    const [emojiToggle, setEmojiToggle] = useState(true);
    const menuRef = useRef();

    const { user, setMessages, chat, chatId } = useContext(UserContext);

    const showLink = () => {
        if(hidden === 'hidden'){
          setHidden('');
          setHide('hidden');
        } else if(hidden === ''){
          setHidden('hidden');
          setHide('');
        }
      };
    
      const sendMessage = () => {
        try{
          const decoded = jwtDecode(user.accessToken);
          const messageSend = {id: decoded.user._id, chat: chat, image: image, message: content, video: link, date: Date.now()};
          axios.post(`${import.meta.env.VITE_URI}/message`, messageSend, {headers: { "Content-Type": "application/json" }})
            .then((res) => {
              socket.emit('send_message', {message: res.data, chat: chatId.current})
              setMessages(content => [...content, res.data]);
              setContent('');
              setLink('');
              return () => socket.off("message");
            })
          
        }catch(err){
          console.log(err);
        };
      };

      const convertImage = (e) => {
        const data = new FileReader();
        data.addEventListener('load', () => {
        setImage(data.result);
      });
      data.readAsDataURL(e.target.files[0]);
      };

      useEffect(() => {
        let handler = (e) => {
          if(!menuRef.current.contains(e.target)){
            setOptions(false);
          };      
        };

        document.addEventListener('mousedown', handler);
        return() => {document.removeEventListener('mousedown', handler);};
      });

  return (
    <div className="send-message">
      <div className="emoji-container-btn">
        <faIcons.FaSmile className='emoji-icon' onClick={() => {setEmojiToggle(!emojiToggle)}}/>
      </div>
        <Emoji hidden = {emojiToggle} content={content} setContent={setContent} setEmoji={setEmojiToggle}/>
        <textarea required cols='10' className={`message-input ${hide}`} autoComplete='off' value={content} onChange={(e) => setContent(e.target.value)} placeholder='Send a message'/>
        <input type="text" className={`${hidden}`} placeholder='Send a link' id='link' value={link} onChange={(e) => setLink(e.target.value)} autoComplete='off'/>
        <div className="dropdown" ref={menuRef}>
          <div className={`content ${options == false ? 'hidden' : ''}`}>
            <div className="img-upload">
              <label htmlFor="img" className='img-label'><faIcons.FaImage className='msg-icon'/>Image</label>
              <input type="file" name="img" id="img" onChange={convertImage}/>
            </div>
            <div className="img-upload">
              <label htmlFor="link" className='img-label' onClick={showLink}>{
              hidden == 'hidden' ? <><faIcons.FaLink className='msg-icon'/>Link</> : <><faIcons.FaPenFancy className='msg-icon'/>Message</>}</label>
            </div> 
          </div>
          <faIcons.FaEllipsisV className='menu-icon' onClick={() => setOptions(!options)}/>
        </div>
        <button className='send-message-btn' onClick={sendMessage}><IoIcons.IoMdSend className='send-icon' /></button>
    </div>
  )
}

export default SendMessage