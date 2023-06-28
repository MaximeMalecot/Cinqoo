import { useEffect, useState } from "react";
import { UserData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminUsers() {
    const [users, setUsers] = useState<UserData[]>([]);

    const fetchUsers = async () => {
        try {
            const res = await userService.getUsers();
            console.log(res);
            setUsers(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return <div>Users</div>;
}
