import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as IoIcons from 'react-icons/io'
import * as faIcons from 'react-icons/fa'
import UserContext from '../Context/UserContext'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { jwtDecode } from 'jwt-decode'

function GroupPage() {
  const [group, setGroup] = useState(false);
  const [members, setMembers] = useState(false);
  const [users, setUsers] = useState(false);
  const [status, setStatus] = useState('');
  const [hidden, setHidden] = useState('hidden');
  const { user } = useContext(UserContext);
  const decodedUser = jwtDecode(user.accessToken);
  const navigate = useNavigate();
  const id = useParams();

  const addMembers = (id) => {
    const userAdd = {userId: id}
    axios.put(`${import.meta.env.VITE_URI}/group/${group._id}/add`, userAdd, {headers: { "Content-Type": "application/json" }})
       .then((res) => setStatus(res.data))
       .then(() => {
          if(status == 'ok'){
            toast.success("User added successfully");
            
            navigate('/groups');
        } else if(status == 'error'){
            toast.error("User already in this group");
        };
       })
        .catch(err => console.log(err));
    setHidden('hidden');
};

const deleteGroup = () => {
  axios.delete(`${import.meta.env.VITE_URI}/group/${group._id}/deletegroup`, {headers: { "Content-Type": "application/json" }})
        .catch(err => console.log(err));
        toast.success("Group deleted successfully");
        navigate('/');
};

const leaveGroup = (id) => {
  axios.put(`${import.meta.env.VITE_URI}/group/${group._id}/delete`, {userId: id}, {headers: { "Content-Type": "application/json" }})
        .catch(err => console.log(err));
        toast.success("Group exited successfully");
        navigate('/');
};

const removeUser = (id) => {
  axios.put(`${import.meta.env.VITE_URI}/group/${group._id}/delete`, {userId: id}, {headers: { "Content-Type": "application/json" }})
        .catch(err => console.log(err));
        toast.success("Member removed successfully");
        navigate(`/groups`);
};

  useEffect(() => {
    axios({method: 'GET', url: `${import.meta.env.VITE_URI}/group/${id.id}`}, {headers: { "Content-Type": "application/json" }})
        .then((res) => {setGroup(res.data); setMembers(res.data.members)});

    axios({method: 'GET', url: `${import.meta.env.VITE_URI}/register/getusers`}, {headers: { "Content-Type": "application/json" }})
      .then((res) => setUsers(res.data))
},[group]);

  return (
    <section>
      {group === false ? '' : <h2>{group.name ? group.name : ''}</h2>} 
      {
      group === false ? '' : decodedUser.user._id === group.creator._id ? <div className="admin-role">
        <p onClick={() => deleteGroup()}>Delete group</p>
        <p onClick={() => setHidden(hidden == 'hidden' ? '' : 'hidden')}>Add Member</p>
      </div>   :
      <p onClick={() => leaveGroup(decodedUser.user._id)}>Leave group</p>
      }   
      <div className="user-container">
        <div className="users">
        <h3 className={`${hidden}`}>Add Users</h3>
            {
            users === false ? '':
              users.map((res, key) => {
                return (res._id !== decodedUser.user._id ?(
                  <div className={`user ${hidden}`} key={key}>
                    <div className="user-info">
                      <div className="img-container">
                        <img className='user-img' src={res.profileImg.image} alt="user icon" />
                      </div>
                      <span>{res.name + " " + res.surname}</span>
                    </div>   
                    <div className="user-options">
                      <ul className='options-user'>
                        <li onClick={() => addMembers(res._id)}><faIcons.FaPlus /></li> 
                      </ul>
                    </div>                                                   
                  </div>):''
                )
            })
            }
            <h3>Members</h3>
          {
            members === false ? '' :
            members < 0 ? <p>There are no group members</p> :
            members.map((member, index) => {
              return (
                <div className="user" key={index}>
                  <div className="user-info">
                    <div className="img-container">
                      <img className='user-img' src={member.user.profileImg.image} alt="user icon" /> 
                    </div>
                    <span>{member.user.name + " " + member.user.surname}</span>
                  </div>   
                  {
                      decodedUser.user._id !== group.creator._id ? "" :
                      <div className="user-options">
                        <ul className='options-user'>
                          <li onClick={() => removeUser(member.user._id)}><IoIcons.IoMdRemoveCircle /></li>
                         </ul>
                      </div>                     
                  }                                                       
                </div>
              )
            })
            }
        </div>
      </div>
    </section>
  )
}

export default GroupPage