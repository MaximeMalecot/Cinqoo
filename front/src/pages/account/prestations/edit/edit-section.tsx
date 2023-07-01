import { useCallback } from "react";
import PrestationForm from "../../../../components/prestation/prestation-form";
import {
    CreatePrestationForm,
    PrestationItemList,
} from "../../../../interfaces/prestation";
import prestationService from "../../../../services/prestation.service";
import { displayMsg } from "../../../../utils/toast";

interface EditSectionProps {
    prestation: PrestationItemList;
    refetch: () => void;
}

export default function EditSection({ prestation, refetch }: EditSectionProps) {
    const updatePrestation = useCallback(
        async (data: CreatePrestationForm, image?: File | null) => {
            try {
                if (!image) {
                    throw new Error("You must provide an image");
                }
                await prestationService.updatePrestation(
                    prestation._id,
                    data as CreatePrestationForm,
                    image ?? undefined
                );

                displayMsg("Prestation updated", "success");
                refetch;
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        []
    );

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Prestation informations</h2>

            <PrestationForm
                initData={prestation}
                submitCb={updatePrestation}
                label={"Save"}
            />
        </div>
    );
}
