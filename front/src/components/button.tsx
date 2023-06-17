interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    visual?:
        | "primary"
        | "secondary"
        | "bordered-primary"
        | "bordered-secondary";
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
