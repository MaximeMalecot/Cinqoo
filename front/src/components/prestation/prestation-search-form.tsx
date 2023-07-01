import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../interfaces/category";
import { PrestationFilters } from "../../interfaces/prestation";
import Button from "../button";
import { Input } from "../input";

interface PrestationSearchFormProps {
    initData?: PrestationFilters;
    handleSearch: (data: any) => void;
    categories?: Category[];
}

export default function PrestationSearchForm({
    initData,
    handleSearch,
    categories,
}: PrestationSearchFormProps) {
    const { register: registerField, handleSubmit } = useForm();

    const onSubmit = useCallback(async (data: PrestationFilters) => {
        if (data.categories === "") {
            delete data.categories;
        }
        handleSearch(data);
    }, []);

    return (
        <form
            className="flex flex-col gap-2 flex-wrap md:flex-row overflow-hidden rounded round-xl w-full"
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
            <select
                {...registerField("categories", {
                    value: initData?.categories,
                    required: false,
                })}
                defaultValue={initData?.categories ?? ""}
                className="select w-full md:max-w-xs border border-1 border-slate-300 !outline-none p-2 rounded-md"
            >
                {!categories || categories.length === 0 ? (
                    <option disabled>No category available</option>
                ) : (
                    <>
                        <option value="">All categories</option>
                        {categories.map((r, index) => (
                            <option
                                key={index}
                                value={r._id}
                                selected={initData?.categories === r._id}
                            >
                                {r.name}
                            </option>
                        ))}
                    </>
                )}
            </select>
            <Button type="submit" visual="bordered-primary">
                Search
            </Button>
            <div className="divider my-0" />
        </form>
    );
}
