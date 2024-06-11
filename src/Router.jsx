import React, { useContext } from 'react'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import UserContext from './Context/UserContext'
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import UsersList from './Pages/UsersList';
import Friends from './Pages/Friends';
import Group from './Pages/Group';
import CreateGroup from './Pages/CreateGroup';
import GroupPage from './Pages/GroupPage';
import Profile from './Pages/Profile';
import ProfileEdit from './Pages/ProfileEdit';
import Chats from './Pages/Chats';

function Router() {
    const { user, ProtectedRoutes } = useContext(UserContext);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<App />}>
                <Route path='/login' element={<Login />}/>
                <Route path='/register' element={<Register />}/>
                <Route element={<ProtectedRoutes />}>
                    <Route index element={<Home />}/>
                    <Route path='/:id' element={<Home />}/>
                    <Route path='/users' element={<UsersList />}/>
                    <Route path='/chats' element={<Chats />}/>
                    <Route path='/friends' element={<Friends />}/>
                    <Route path='/groups' element={<Group />}/>
                    <Route path='/creategroup' element={<CreateGroup />}/>
                    <Route path='/groups/:id' element={<GroupPage />}/>
                    <Route path='/yourprofile' element={<Profile />}/>
                    <Route path='/yourprofile/edit' element={<ProfileEdit />}/>
                </Route>
            </Route>
        )
    )
  return <RouterProvider router = {router}/>
}

export default Router