import { useParams } from "react-router-dom";

export default function Prestation() {
    const { id } = useParams();

    return (
        <div>
            <h1>Prestation</h1>
        </div>
    );
}
