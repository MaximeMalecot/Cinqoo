interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    visual?:
        | "primary"
        | "secondary"
        | "bordered-primary"
        | "bordered-secondary"
        | "danger"
        | "bordered-danger";
}

export default function Button({
    children,
    className,
    visual = "primary",
    ...props
}: ButtonProps) {
    const visualToClassName = {
        primary: "btn btn-primary",
        secondary: "btn btn-secondary",
        "bordered-primary":
            "btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent",
        "bordered-secondary":
            "btn bg-transparent border border border-secondary text-secondary hover:bg-secondary hover:text-white hover:border-transparent",
        "bordered-danger":
            "btn bg-transparent border border border-error text-error hover:bg-error hover:text-white hover:border-transparent",
        danger: "btn btn-error text-white hover:opacity-90",
    };

    return (
        <button
            {...props}
            className={`${className} ${
                visualToClassName[visual] ?? visualToClassName["primary"]
            }`}
        >
            {children}
        </button>
    );
}
