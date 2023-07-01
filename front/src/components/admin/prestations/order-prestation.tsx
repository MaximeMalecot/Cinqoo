import { PrestationItemList } from "../../../interfaces/prestation";

interface PrestationOrderProps {
    prestation: PrestationItemList;
}

export default function PrestionOrder({ prestation }: PrestationOrderProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-1 justify-between">
                <h2 className="text-2xl text-black">{prestation.name}</h2>
            </div>
            <div
                className="duration-700 bg-slate-200 hover:bg-slate-300 rounded-md p-5 overflow-hidden w-full"
                style={{
                    maxHeight: "440px",
                    height: "440px",
                }}
            >
                <img
                    src={prestation.image}
                    alt="Your prestation image"
                    className="object-contain w-full h-full"
                />
            </div>
            <div>
                <h3 className="text-xl font-bold">About this prestation</h3>
                <p>
                    {prestation.description.length > 0
                        ? prestation.description
                        : "This prestation has no description"}
                </p>
            </div>
        </div>
    );
}
