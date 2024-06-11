import React, { useContext, useState } from 'react'
import UserContext from '../Context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ProfileEdit() {
    const { user, setUser } = useContext(UserContext);
    const decoded = jwtDecode(user.accessToken);

    const [name, setName] = useState(decoded.user.name);
    const [surname, setSurname] = useState(decoded.user.surname);
    const [email, setEmail] = useState(decoded.user.email);

    const navigate = useNavigate();

    const submitForm = (e) => {
        e.preventDefault();
        const token = { token: user.refreshToken };
        const newName = name.replace(/\s/g, "");
        const newSurname = surname.replace(/\s/g, "");

        const updated = {name: newName, surname: newSurname, email};
        try{
            axios.put(`${import.meta.env.VITE_URI}/register/${decoded.user._id}`, updated, {headers: { "Content-Type": "application/json" }})
            .then(res => res.data)
            .then(status => {
                if(status === "failed"){
                toast.error("This email already exists.");
                } else if(status === "ok"){
                    axios.post(`${import.meta.env.URI}/login/logout`, token, {
                        headers: {
                            "Content-Type": "application/json"
                            }
                        });
                    setUser(false);
                    navigate('/login');
                    toast.success("You have updated your details successfully");
                };
                console.log(status)
            })
            .catch(err => console.log(err));    

        }catch(err){
        console.log(err);
        };  
    };

  return (
    <section>
        <h1 className="register-title">Edit your profile</h1>
        <form method='POST' className='register-form' onSubmit={submitForm}>
            <input type="text" name='name' id='name' className='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name'/>
            <input type="text" name='surname' id='surname' className='surname' value={surname} onChange={(e) => setSurname(e.target.value)} placeholder='Surname'/>
            <input type="email" name='email' id='email' className='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
            <button type='submit' className='form-btn'>Submit</button>
        </form>
    </section>
  )
}

export default ProfileEdit