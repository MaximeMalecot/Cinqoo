import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrestationForm from "../../../components/prestation/prestation-form";
import { CreatePrestationForm } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";

export default function CreatePrestation() {
    const navigate = useNavigate();

    const onSubmit = useCallback(
        async (data: CreatePrestationForm, image?: File | null) => {
            try {
                if (!image) {
                    throw new Error("You must provide an image");
                }
                const res = await prestationService.createPrestation(
                    data as CreatePrestationForm,
                    image
                );
                if (res._id) {
                    displayMsg("Prestation created", "success");
                    navigate(`/account/prestations/${res._id}/edit`);
                }
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        []
    );

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <p>Account</p>
                    </li>
                    <li>
                        <Link to="/account/prestations">Prestations</Link>
                    </li>
                    <li>Create</li>
                </ul>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Create Prestation</h1>
            </div>
            <PrestationForm submitCb={onSubmit} label={"Create"} />
        </div>
    );
}
