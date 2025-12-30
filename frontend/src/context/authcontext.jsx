import React, { createContext, useState } from 'react'



export const AuthContext = createContext();

 function Authcontext  ({children}) {
    const [user, setUser] = useState(null)

    
    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData));
    }
    
  //   const logout = async () => {
  //   await axios.post(
  //     "http://localhost:8000/api/v1/library/logout",
  //     {},
  //     { withCredentials: true } // important to send cookies
  //   );
  //   setUser(null);
  //   navigate("/login");
  // };
    
    return (
        <AuthContext.Provider value={{user, login}}>
            {children}
        </AuthContext.Provider>
    )
}
export default Authcontext

  

 