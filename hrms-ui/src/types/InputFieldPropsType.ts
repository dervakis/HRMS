import type { InputHTMLAttributes } from "react";

export interface InputFieldPropsType extends InputHTMLAttributes<HTMLInputElement>{
    label?: string,
    error?: string,
    className?: string
}