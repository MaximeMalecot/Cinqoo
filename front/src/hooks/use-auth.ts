import jwt_decode from "jwt-decode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY } from "../constants/keys";
import { ROLES } from "../constants/roles";
import { UserData } from "../interfaces/user";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { notify } from "../utils/toast";

interface TokenInterface {
    exp: number;
    iat: number;
    sub: string;
    username: string;
    roles: string[];
}

const decodeToken = (token: string): TokenInterface | null => {
    try {
        const decoded = jwt_decode(token);
        return decoded as TokenInterface;
    } catch (e) {
        return null;
    }
};

const useAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const isConnected = useMemo(() => !!token && !!userData, [token, userData]);
    const isFreelancer =
        isConnected &&
        (userData?.roles.includes(ROLES.FREELANCER) ? true : false);
    const navigate = useNavigate();

    const register = useCallback(
        async (mail: string, password: string, username: string) => {
            return await authService.register(mail, password, username);
        },
        []
    );

    const login = useCallback(async (mail: string, password: string) => {
        const res = await authService.login(mail, password);
        if (res && res.access_token) {
            setToken(res.access_token);
            localStorage.setItem(TOKEN_STORAGE_KEY, res.access_token);
        }
        return true;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUserData(null);
        return true;
    }, []);

    const getUser = useCallback(async () => {
        if (!token) return;
        const res = await userService.getSelf();
        if (res) {
            setUserData(res);
        } else {
            logout();
            navigate("/login");
        }
    }, [token]);

    useEffect(() => {
        const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!localToken) return;
        const decoded = decodeToken(localToken);
        if (!decoded) {
            logout();
            return;
        }
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            notify("Expired token, please login again");
            logout();
            return;
        } else {
            setToken(localToken);
        }
    }, []);

    useEffect(() => {
        if (token) getUser();
    }, [token]);

    return {
        data: userData,
        login,
        logout,
        isConnected,
        register,
        reload: getUser,
        isFreelancer,
    };
};

export default useAuth;
