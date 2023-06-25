import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    CreatePrestationForm,
    PrestationItemList,
} from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";
import PrestationForm from "./prestation-form";

export default function EditPrestation() {
    const [prestation, setPrestation] = useState<PrestationItemList | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams();

    const updatePrestation = useCallback(
        async (data: CreatePrestationForm, image?: File | null) => {
            try {
                if (!id) {
                    throw new Error("You must provide a valid id");
                }
                if (!image) {
                    throw new Error("You must provide an image");
                }
                await prestationService.updatePrestation(
                    id,
                    data as CreatePrestationForm,
                    image ?? undefined
                );

                displayMsg("Prestation updated", "success");
                fetchPrestation(id);
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [id]
    );

    const fetchPrestation = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const res = await prestationService.getPrestation(id);
            setPrestation(res);
        } catch (e: any) {
            console.log(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchPrestation(id);
        }
    }, [id]);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Edit Prestation</h1>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <PrestationForm
                    initData={prestation}
                    submitCb={updatePrestation}
                    label={"Save"}
                />
            )}
        </div>
    );
}
