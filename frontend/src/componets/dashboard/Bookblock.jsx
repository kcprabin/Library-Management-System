import React from 'react'
import {FAbook} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
const Bookblock = () => {
  return (
    <div>
        <NavLink>
            <FAbook className ="text-ig"/>
       <h3>Book</h3>
       </NavLink>
    </div>
  )
}

export default Bookblock
