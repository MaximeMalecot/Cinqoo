import { useParams } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams();
    return <>FORGOT PWD</>;
}
