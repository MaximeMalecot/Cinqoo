import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const onSubmit = useCallback(async (data: any) => {
        try {
            const res = await reportService.createReportReason(data.type, {
                name: data.name,
                description: data.description,
            });
            displayMsg("Report reason created successfully", "success");
            setTimeout(() => {
                navigate(`/admin/report_reason/${res._id}`);
            }, 2000);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <div className="overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <h1 className="text-2xl">Create report reason</h1>
            <form
                className="flex flex-col gap-5 py-0 overflow-hidden rounded round-xl w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <select
                    className="select select-bordered "
                    {...registerField("type", {
                        required: true,
                    })}
                    defaultValue={""}
                >
                    <option disabled value="">
                        Select a type
                    </option>
                    <option value={ReportReasonEnum.USER}>
                        {ReportReasonEnum.USER}
                    </option>
                    <option value={ReportReasonEnum.SERVICE}>
                        {ReportReasonEnum.SERVICE}
                    </option>
                </select>
                {errors.type && (
                    <span className="text-xs text-red-500">
                        This field is required
                    </span>
                )}
                <Input
                    type="text"
                    placeholder="Name"
                    register={registerField("name", {
                        required: true,
                    })}
                />
                {errors.name && (
                    <span className="text-xs text-red-500">
                        This field is required
                    </span>
                )}
                <Input
                    type="text"
                    placeholder="Description"
                    register={registerField("description", {
                        required: true,
                    })}
                />
                {errors.description && (
                    <span className="text-xs text-red-500">
                        This field is required
                    </span>
                )}
                <Button type="submit" visual="primary">
                    Create
                </Button>
            </form>
        </div>
    );
}
