import React, { useContext, useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'
import UserContext from '../Context/UserContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Profile() {
  const { user, setUser, imageInfo } = useContext(UserContext);
  const [hidden, setHidden] = useState('hidden');
  const [image, setImage] = useState(false);
  const [img, setImg] = useState(false);
  const [chats, setChats] = useState(false);
  const [groups, setGroups] = useState(false);
  const decoded = jwtDecode(user.accessToken);

  const navigate = useNavigate();

  const updateImg = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_URI}/register/${decoded.user._id}/updateimg`, {imageId: image._id}, {headers: {"Content-Type": "application/json"}});

    const token = { token: user.refreshToken };
      axios.post(`${import.meta.env.VITE_URI}/login/logout`, token, {
          headers: {
              "Content-Type": "application/json",
              "authorization": "Bearer " + user.accessToken
              }
      });
      setUser(false);
      toast.success('You have updated your profile icon.');
      navigate('/login');
  };

  const convertBase64 = (e) => {
    const data = new FileReader();
    data.addEventListener('load', () => {
      setImg(data.result);
      axios.post(`${import.meta.env.VITE_URI}/postimage`, {image: data.result}, {headers: { "Content-Type": "application/json" }})
      .then((res) => {setImage(res.data)})
    });
    data.readAsDataURL(e.target.files[0]);
  };

  const deleteAccount = () => {
    if(groups.length !== 0){
      toast.error('You must delete or leave all your groups first.');
    } else if(chats.length !== 0){
      toast.error('You must delete all your chats first');
    } else if(groups.length == 0 && chats.length == 0){
      axios.delete(`${import.meta.env.VITE_URI}/register/${decoded.user._id}/delete`, {userId: decoded.user._id}, {headers: {"Content-Type": "application/json"}})
      .then((res) => console.log(res.data))
      toast.success("You have successfully deleted your account.");
      setUser(false);
      navigate('/login');
    };
  };

  useEffect(() => {
    axios({method: "GET", url: `${import.meta.env.VITE_URI}/chat/${decoded.user._id}`}, {headers: {"Content-Type": "application/json"}})
    .then(res => setChats(res.data)
    ).catch(err => console.log(err));  

    axios({method: 'GET', url: `${import.meta.env.VITE_URI}/group/${decoded.user._id}/getgroups`}, {headers: { "Content-Type": "application/json" }})
    .then((res) => setGroups(res.data));
  },[]);

  return (
    <section>
      <h1 className='register-title'>Profile</h1>
      <div className="admin-role">
        <p className='delete-account' onClick={() => setHidden(hidden == 'hidden' ? '' : 'hidden')}>Delete Account</p>
        <Link to='/yourprofile/edit'>Edit Account</Link>
      </div>

      <div className={`delete-account ${hidden}`}>
        <p>Are you sure?</p>
        <button className='delete' onClick={deleteAccount}>Delete</button>
      </div>

      <div className="user-information">
        <div className="user-image">
          <img className='user-icon' src={decoded.user.profileImg.image} alt="user icon" />
          <div className="update-img">

            <form method='PUT' className='update-pic' onSubmit={updateImg}>
              <input type="file" lable="Image" name="myFile" id="file-upload" accept='.jpeg, .png, .jpg' onChange={convertBase64}/>
              <button type='submit' className='form-btn'>Update</button>
            </form>

          </div>
        </div>
        <div className="user-details">
          <p>Name: {decoded.user.name}</p>
          <p>Surname: {decoded.user.surname}</p>
          <p>Email: {decoded.user.email}</p>
        </div>
      </div>
    </section>
  )
}

export default Profile