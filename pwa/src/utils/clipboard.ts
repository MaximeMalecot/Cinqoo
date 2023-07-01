import { notify } from "./toast";

interface CopyToClipboardParams {
    text: string;
    label?: string;
    toast?: boolean;
}

export const copyToClipboard = ({
    text,
    label,
    toast,
}: CopyToClipboardParams) => {
    navigator.clipboard.writeText(text);
    if (toast) {
        if (label) {
            notify(`${label} copied to clipboard`);
        } else {
            notify(`Copied to clipboard`);
        }
    }
};
