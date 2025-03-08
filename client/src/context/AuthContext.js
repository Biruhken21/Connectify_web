
import { createContext, useEffect, useReducer, useRef } from "react";
import AuthReducer from "./AuthReducer";


//  even if localStorage has bad data, the app won't crash!

const getUserFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

const INITIAL_STATE = {
    user: getUserFromLocalStorage(),
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const lastSavedUser = useRef(state.user);
    // localStorage only updates when state.user actually changes.
    useEffect(() => {
        if (state.user !== lastSavedUser.current) {
            console.log("Saving user to localStorage:", state.user);
            if (state.user) {
                localStorage.setItem("user", JSON.stringify(state.user));
            } else {
                localStorage.removeItem("user");
            }
            lastSavedUser.current = state.user; // Update ref after saving
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }}>
          {children}
        </AuthContext.Provider>
    )
}