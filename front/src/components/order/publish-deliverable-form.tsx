import { useCallback, useState } from "react";
import { displayMsg } from "../../utils/toast";
import Button from "../button";
import { Input } from "../input";

interface PublishDeliverableProps {
    publish: ({ name, file }: { name: string; file: File }) => void;
}

export default function PublishDeliverable({
    publish,
}: PublishDeliverableProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = useCallback((e: any) => {
        const localFile = e.target.files[0];
        if (localFile) {
            setFile(localFile);
            console.log(localFile);
        }
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                setLoading(true);
                if (!name || name.trim().length === 0) {
                    throw new Error("Please enter a valid name");
                }
                if (!file) {
                    throw new Error("Please select a file");
                }

                publish({ name: name.trim(), file });
                setName("");
                setFile(null);
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            } finally {
                setLoading(false);
            }
        },
        [name, file]
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 border border-slate-300 border-x-0 border-b-0 border-t-1 pt-3"
        >
            <Input
                placeholder="Deliverable name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
            />
            <div className="flex flex-col w-full flex-1">
                <input
                    type="file"
                    className="file-input file-input-bordered file-input-md w-full"
                    onChange={handleFileChange}
                />
            </div>
            <Button disabled={loading} type="submit" className="ml-auto px-10">
                {loading && <span className="loading loading-spinner"></span>}
                Publish
            </Button>
        </form>
    );
}
