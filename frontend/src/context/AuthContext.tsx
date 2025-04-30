import { createContext, useEffect, useReducer, ReactNode, Dispatch } from "react";
import AuthReducer from "./AuthReducer";
import { AuthState, AuthAction } from "./types";    

interface AuthContextProviderProps {
  children: ReactNode;
}

interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

const INITIAL_STATE: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null") || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext<AuthContextType>({
  ...INITIAL_STATE,
  dispatch: () => null, // Default dispatch function
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 