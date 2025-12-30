
import React ,{useEffect,useState,useContext}from 'react'
import axios from 'axios'
import { getUser } from '../../fetch'
import { AuthContext } from '../../context/authcontext';
import { useNavigate } from 'react-router-dom';



const Navbar = () => {

 
 const navigate = useNavigate();

  const [data,setData] = useState([]);
  useEffect(() => {
    getUser().then(posts => setData(posts))

  } ,[navigate]) 
  const out=async()=>{
     await axios.post(
      "http://localhost:8000/api/v1/library/logout",
      {},
      { withCredentials: true }
  )}
  
  return (
    <div className='flex items-center justify-between h-12 bg-teal-600 px-6 text-white shadow-md'>
      <p className='pl-69 text-lg font-semibold'>Welcome, {data.length > 0 ? data[0]?.name : "Student"}
</p>

      <button 
         onClick={() => {
    out();
    navigate('/login'); }}
        className='bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-md transition-colors duration-200'
              >
        Logout
      </button>
    </div>
  )
}

export default Navbar