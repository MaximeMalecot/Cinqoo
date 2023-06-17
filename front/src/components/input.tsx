interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    register?: any;
}

export function Input({ className, register, ...props }: InputProps) {
    return (
        <input
            {...props}
            {...register}
            className={`${className} border border-1 border-slate-300 !outline-none p-2 rounded-md`}
        />
    );
}
