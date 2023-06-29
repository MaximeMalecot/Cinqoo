import React, { createContext, useContext } from "react";
import useAuth from "../hooks/use-auth";
import { UserData } from "../interfaces/user";

interface Props {
    children: React.ReactNode;
}

type AuthContextType = {
    register: (
        mail: string,
        password: string,
        username: string
    ) => Promise<boolean>;
    login: (mail: string, password: string) => Promise<boolean>;
    logout: () => void;
    isConnected: boolean;
    isFreelancer: boolean;
    isAdmin: boolean;
    data: UserData | null;
    reload: () => void;
};

const AuthContext = createContext<AuthContextType>({
    register: async () => false,
    login: async () => false,
    logout: () => {},
    isConnected: false,
    isFreelancer: false,
    isAdmin: false,
    data: null,
    reload: () => {},
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider"
        );
    }

    return context;
};

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
    const {
        login,
        logout,
        isConnected,
        register,
        data,
        reload,
        isFreelancer,
        isAdmin,
    } = useAuth();

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                isConnected,
                register,
                data,
                reload,
                isFreelancer,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
