import React, { useContext, useState } from 'react'
import axios from 'axios'
import UserContext from '../Context/UserContext';

function ImageUpload() {
  const { user, setImageInfo } = useContext(UserContext);
    const [img, setImg] = useState('')

    const convertBase64 = (e) => {
      const data = new FileReader();
      data.addEventListener('load', () => {
        setImg(data.result);
        axios.post(`${import.meta.env.VITE_URI}/postimage`, {image: data.result}, {headers: { "Content-Type": "application/json" }})
        .then((res) => {setImageInfo(res.data)})
      });
      data.readAsDataURL(e.target.files[0]);
    };
  
    return (
      <>
        <input type="file" lable="Image" name="myFile" id="file-upload" accept='.jpeg, .png, .jpg' onChange={convertBase64}/>      
      </>
    )
}

export default ImageUpload;