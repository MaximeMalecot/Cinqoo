import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { ReportReasonEnum } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

export default function CreateReportReason() {
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(async (data: any) => {
        try {
            const res = await reportService.createReportReason(data.type, {
                name: data.name,
                description: data.description,
            });
            displayMsg(res.message, "success");
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <div>
            Create report reason
            <form
                className="flex overflow-hidden rounded round-xl w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <select
                    {...registerField("type", {
                        required: true,
                    })}
                >
                    <option value={ReportReasonEnum.USER}>
                        {ReportReasonEnum.USER}
                    </option>
                    <option value={ReportReasonEnum.SERVICE}>
                        {ReportReasonEnum.SERVICE}
                    </option>
                </select>
                <Input
                    type="text"
                    placeholder="Name"
                    register={registerField("name", {
                        required: true,
                    })}
                />
                <Input
                    type="text"
                    placeholder="Description"
                    register={registerField("description", {
                        required: true,
                    })}
                />
                <Button type="submit" visual="primary">
                    Create
                </Button>
            </form>
        </div>
    );
}
