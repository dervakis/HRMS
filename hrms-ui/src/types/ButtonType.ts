import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonType extends ButtonHTMLAttributes<HTMLButtonElement>{
    children?: ReactNode,
    varient?: string,
    size?: string,
    className?: string
}