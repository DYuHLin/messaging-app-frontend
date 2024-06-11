import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { Link, useNavigate } from 'react-router-dom'
import * as IoIcons from 'react-icons/io'
import * as AiIcons from 'react-icons/ai'
import { SidebarData } from './SidebarData'
import * as RiIcons from 'react-icons/ri'
import { IconContext } from 'react-icons/lib'
import UserContext from '../Context/UserContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { jwtDecode } from 'jwt-decode'

function Sidebar() {
    const [sidebar, setSidebar] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const showSidebar = () => {
        //changes to the opposite of whatever boolean value is present
        setSidebar(!sidebar);
    };

    const navigate = useNavigate();

    const logout = async () => {
        const decoded = jwtDecode(user.accessToken);
        const token = { token: user.refreshToken, email: decoded.user.email };
        axios.post(`${import.meta.env.VITE_URI}/login/logout`, token, {
            headers: {
                "Content-Type": "application/json",
                }
        });
        setUser(false);
        navigate('/login');
        toast.success("You have logged out successfully");
      };

  return (
    <>
    <IconContext.Provider value={{color: '#fff'}}>
        <div className="navbar">
            <Link to="#" className='menu-bars'>
                <RiIcons.RiArrowRightDoubleFill onClick={showSidebar}/>
            </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className="nav-menu-items" onClick={showSidebar}>
                <li className="navbar-toggle">
                    <Link to="#" className='menu-bars'>
                        <AiIcons.AiOutlineClose />
                    </Link>
                </li>
                {SidebarData.map((item, index) => {
                    return(
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icons}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
                <li className='nav-text'>
                    <div className="logout" onClick={logout}>
                        <IoIcons.IoMdLogOut />
                        <span>Logout</span>
                    </div>
                </li>
            </ul>
        </nav>
    </IconContext.Provider>
    </>
  )
}

export default Sidebar