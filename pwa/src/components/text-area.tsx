interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLInputElement> {
    className?: string;
    register?: any;
}

export function TextArea({ className, register, ...props }: TextAreaProps) {
    return (
        <textarea
            {...props}
            {...register}
            className={`${className} resize-none border border-1 border-slate-300 !outline-none p-2 rounded-md`}
        />
    );
}
