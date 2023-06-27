import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { PrestationFilters } from "../../interfaces/prestation";
import Button from "../button";
import { Input } from "../input";

interface PrestationSearchFormProps {
    initData?: PrestationFilters;
    handleSearch: (data: any) => void;
}

export default function PrestationSearchForm({
    initData,
    handleSearch,
}: PrestationSearchFormProps) {
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(async (data: PrestationFilters) => {
        handleSearch(data);
    }, []);

    return (
        <form
            className="flex overflow-hidden rounded round-xl w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Input
                type="text"
                placeholder="Name"
                register={registerField("query", {
                    value: initData?.query,
                    required: false,
                })}
            />
            <Input
                type="number"
                placeholder="Minimum price"
                register={registerField("price_min", {
                    value: initData?.price_min,
                    required: false,
                    min: {
                        value: 0,
                        message: "Minimum price must be greater or equal to 0",
                    },
                })}
            />
            <Input
                type="number"
                placeholder="Maximum price"
                register={registerField("price_max", {
                    value: initData?.price_max,
                    required: false,
                    min: {
                        value: 0,
                        message: "Maximum price must be greater than 0",
                    },
                })}
            />
            <Button type="submit" visual="bordered-primary">
                Search
            </Button>
        </form>
    );
}
