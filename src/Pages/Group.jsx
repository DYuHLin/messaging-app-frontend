import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../Context/UserContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'

function Group() {
  const { user } = useContext(UserContext);
  const [groups, setGroups] = useState(false);
  const [search, setSearch] = useState('');
  const decoded = jwtDecode(user.accessToken);

  useEffect(() => {
    axios({method: 'GET', url: `${import.meta.env.VITE_URI}/group/${decoded.user._id}/getgroups`}, {headers: { "Content-Type": "application/json" }})
        .then((res) => setGroups(res.data))
},[]);

  return (
    <section>
      <h1>Group</h1>
      <Link to='/creategroup'>Create Group</Link>
      <br />
      <div className="user-container">
      <div className="search-user">
        <input type="text" onChange={(e) => {setSearch(e.target.value)}} placeholder='Search groups'/>
      </div>
        <div className="users">
          {
            groups == false ? <p>You have no groups</p> :
            groups.filter((item) => {
              return search.toLocaleLowerCase() === '' ? item : item.name.toLocaleLowerCase().includes(search);
            }).map((group, index) => {
              return (
                <Link key={index} to={`/groups/${group._id}`}>
                  <div className="user">
                    <div className="user-info">
                      <div className="img-container">
                        <img className='user-img' src={group.profileImg.image} alt="user icon" />
                      </div>
                        
                      <span>{group.name}</span>
                    </div> 
                    <p>Created by: {group.creator.name + " " + group.creator.surname}</p>      
                    </div>
                </Link>
              )
            })
            }
        </div>
      </div>
    </section>
  )
}

export default Group