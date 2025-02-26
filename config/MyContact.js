import { createContext, useContext, useEffect, useState } from "react";

export default createContext({
    user: null, // Default user is null
    sposts: () => [],
    dispatch: () => {},
});



// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [accessToken, setAccessToken] = useState(null);

//     const saveToken = (token) => setAccessToken(token);
//     const clearToken = () => setAccessToken(null);

//     return (
//         <AuthContext.Provider value={{ accessToken, saveToken, clearToken }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);