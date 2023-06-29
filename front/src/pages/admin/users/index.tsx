import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { UserData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const res = await userService.getUsers();
            console.log(res);
            setUsers(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className=" overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <h1 className="text-2xl">Users</h1>
            <div className="border-2 rounded rounded-md overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 &&
                            users.map((user) => (
                                <tr className="bg-base-200">
                                    <td>{user._id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles.join(", ")}</td>
                                    <td>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/users/${user._id}`
                                                )
                                            }
                                        >
                                            See
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
