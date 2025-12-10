import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext();

 function Authcontext  ({children}) {
    const [user, setUser] = useState(null)

    
    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData));
    }
    
    const logout = () => {
    // Clear user data
    setUser(null);
    
    // Clear localStorage/sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    
  };
    
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default Authcontext

  

 
