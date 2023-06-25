import { Link } from "react-router-dom";
import { PrestationItemList } from "../../interfaces/prestation";
import Button from "../button";

interface ManagePrestationCardProps {
    prestation: PrestationItemList;
}

export default function ManagePrestationCard({
    prestation,
}: ManagePrestationCardProps) {
    const description =
        prestation.description.length > 100
            ? prestation.description.slice(0, 100) + "..."
            : prestation.description;
    return (
        <div className="card w-72 bg-base-100 shadow-xl border border-2 overflow-hidden">
            <figure
                style={{
                    height: "150px",
                    overflow: "hidden",
                    objectFit: "cover",
                }}
            >
                <img
                    src={prestation.image}
                    className="w-full h-full"
                    alt="Shoes"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title capitalize">
                    {prestation.name} - {prestation.price}$
                </h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    {prestation.isActive && (
                        <Link
                            target="_blank"
                            to={`/prestations/${prestation._id}`}
                            className="flex-1 btn btn-primary"
                        >
                            Visit
                        </Link>
                    )}

                    <Link
                        className="flex-1"
                        to={`/account/prestations/${prestation._id}`}
                    >
                        <Button
                            visual={"bordered-primary"}
                            className="w-full btn btn-primary"
                        >
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
