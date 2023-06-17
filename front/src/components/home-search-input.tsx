import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function HomeSearchInput() {
    const navigate = useNavigate();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(async (data: any) => {
        console.log(data);
        navigate(`/search?q=${data.typed}`, { state: { typed: data.typed } });
    }, []);

    return (
        <form
            className="flex overflow-hidden rounded round-xl w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <input
                {...registerField("typed", { required: true })}
                type="text"
                className="w-full bg-white p-3 w-4/5 !outline-none text-slate-500"
                placeholder="Search for any service"
            />
            <button
                className="bg-secondary p-5 px-10 hover:opacity-80"
                type="submit"
            >
                <svg
                    width="25"
                    height="25"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M26.5554 24.4343L20.6261 18.5027C22.4039 16.1861 23.2339 13.2801 22.9478 10.374C22.6616 7.468 21.2807 4.77962 19.0852 2.85424C16.8897 0.928852 14.044 -0.0893562 11.1253 0.00616022C8.20668 0.101677 5.43364 1.30377 3.36873 3.36858C1.30383 5.43339 0.101681 8.2063 0.00616051 11.1248C-0.0893604 14.0433 0.928895 16.8889 2.85437 19.0843C4.77984 21.2797 7.46835 22.6606 10.3745 22.9467C13.2807 23.2328 16.1869 22.4029 18.5036 20.6251L24.4379 26.5604C24.5773 26.6998 24.7427 26.8103 24.9248 26.8858C25.1069 26.9612 25.3021 27 25.4992 27C25.6962 27 25.8914 26.9612 26.0735 26.8858C26.2556 26.8103 26.421 26.6998 26.5604 26.5604C26.6998 26.4211 26.8103 26.2556 26.8858 26.0735C26.9612 25.8915 27 25.6963 27 25.4992C27 25.3021 26.9612 25.107 26.8858 24.9249C26.8103 24.7428 26.6998 24.5774 26.5604 24.438L26.5554 24.4343ZM3.02169 11.5112C3.02169 9.83213 3.51962 8.19073 4.45252 6.79461C5.38542 5.39849 6.71139 4.31035 8.26275 3.66778C9.81411 3.02522 11.5212 2.8571 13.1681 3.18467C14.815 3.51225 16.3278 4.32081 17.5151 5.50812C18.7025 6.69542 19.5111 8.20814 19.8387 9.85497C20.1663 11.5018 19.9982 13.2088 19.3556 14.7601C18.713 16.3114 17.6248 17.6373 16.2286 18.5701C14.8324 19.503 13.1909 20.0009 11.5118 20.0009C9.26076 19.9986 7.10262 19.1034 5.51093 17.5118C3.91923 15.9202 3.024 13.7621 3.02169 11.5112Z"
                        fill="white"
                    />
                </svg>
            </button>
        </form>
    );
}
