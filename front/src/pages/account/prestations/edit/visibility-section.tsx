import { useCallback, useState } from "react";
import Button from "../../../../components/button";
import { PrestationItemList } from "../../../../interfaces/prestation";
import prestationService from "../../../../services/prestation.service";
import { displayMsg } from "../../../../utils/toast";

interface SectionProps {
    prestation: PrestationItemList;
    reload: () => void;
}

export default function VisibilitySection({
    prestation,
    reload,
}: SectionProps) {
    const [loading, setLoading] = useState(false);

    const enablePrestation = useCallback(async () => {
        try {
            setLoading(true);
            await prestationService.enablePrestation(prestation._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    }, [prestation]);

    const disablePrestation = useCallback(async () => {
        try {
            setLoading(true);
            await prestationService.disablePrestation(prestation._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    }, [prestation]);

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Alter prestation visibility</h2>
            <p className="text-sm">
                You can alter your prestation visibility at any moment.
            </p>
            {prestation.isActive ? (
                <Button
                    disabled={loading}
                    visual="bordered-secondary"
                    onClick={disablePrestation}
                >
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Disable
                </Button>
            ) : (
                <Button
                    disabled={loading}
                    visual="bordered-secondary"
                    onClick={enablePrestation}
                >
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Enable
                </Button>
            )}
        </div>
    );
}
