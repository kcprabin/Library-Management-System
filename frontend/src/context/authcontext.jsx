import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Authcontext = ({children}) => {
    const [user, setUser] = useState(null)
    
    const login = (userData) => {
        setUser(userData)
    }
    
    const logout = () => {
        setUser(null)
        const lol = useNavigate()
           const signout = ()=>{
                  lol("/login")
      }

        
    }
    
    return (
        <userContext.Provider value={{user, login, logout}}>
            {children}
        </userContext.Provider>
    )
}

const userContext = createContext(Authcontext)



export const useAuth = () => useContext(userContext)
export default Authcontext