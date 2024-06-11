import React, { useContext, useState } from 'react'
import UserContext from '../Context/UserContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import * as faIcons from 'react-icons/fa'
import {jwtDecode} from 'jwt-decode'

function CreateGroup() {
    const [name, setName] = useState('');
    const [hidden, setHidden] = useState('');
    const [group, setGroup] = useState('');
    const [status, setStatus] = useState('');
    const [image, setImage] = useState({_id: `${import.meta.env.VITE_PIC}`});
    const [users, setUsers] = useState(false);
    const { user } = useContext(UserContext);
    const decoded = jwtDecode(user.accessToken);

    const handleSubmit = (e) => {
        e.preventDefault();
        try{
            const group = {name: name, id: decoded.user._id, image: image._id};
            axios.post(`${import.meta.env.VITE_URI}/group`, group, {headers: { "Content-Type": "application/json" }})
            .then(res => setGroup(res.data))
                .catch(err => console.log(err));

            axios({method: 'GET', url: `${import.meta.env.VITE_URI}/register/getusers`}, {headers: { "Content-Type": "application/json" }})
                .then((res) => setUsers(res.data))
        }catch(err){
        console.log(err);
        };
        toast.success("Group created successfully");
        setHidden('hidden');

    };

    const addMembers = (id) => {
        const userAdd = {userId: id}
        axios.put(`${import.meta.env.VITE_URI}/group/${group._id}/add`, userAdd, {headers: { "Content-Type": "application/json" }})
           .then(res => setStatus(res.data))
           .then(() => {
            if(status == 'ok'){
                toast.success("User added successfully");
            } else if(status == 'error'){
                toast.error("User already in this group");
            };
           })
            .catch(err => console.log(err))
    };

    const convertBase64 = (e) => {
        const data = new FileReader();
        data.addEventListener('load', () => {
          axios.post(`${import.meta.env.VITE_URI}/postimage`, {image: data.result}, {headers: { "Content-Type": "application/json" }})
          .then((res) => {setImage(res.data)})
        });
        data.readAsDataURL(e.target.files[0]);
      };

  return (
    <section>
        <h3>Create Group</h3>
        <form method='POST' onSubmit={handleSubmit} className={`register-form ${hidden}`}>
                <input type="text" required name='name' id='name' className='name' onChange={(e) => setName(e.target.value)} placeholder='Name'/>
                <input type="file" lable="Image" name="myFile" id="file-upload" accept='.jpeg, .png, .jpg' onChange={convertBase64}/>
                <button className='form-btn'>Create Group</button>
        </form>
        <div className="user-container">
            <div className="users">
            {
            users === false ? '':
                users.map((res, key) => {
                    return (
                            <div className="user" key={key}>
                                <div className="user-info">
                                    <div className="img-container">
                                        <img className='user-img' src={res.profileImg.image} alt="user icon" />
                                    </div>
                                    <span>{res.name + " " + res.surname}</span>
                                </div>                                              
                                <ul className='options-user'>
                                        <li onClick={() => addMembers(res._id)}><faIcons.FaPlus /></li>
                                </ul>
                            </div>
                            )
                        })
                    }
            </div>
        </div>
        <Link to='/groups'>Done</Link>
    </section>
  )
}

export default CreateGroup