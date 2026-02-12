import React from 'react'
import type { ButtonType } from '../types/ButtonType'

function Button({ children, varient = 'green', size = 'md', className = '', ...props }: ButtonType) {
    const baseStyle = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const varientStyle: Map<string, string> = new Map([
        ['green', 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 focus:ring-green-500 shadow-md hover:shadow-lg'],
        ['grey', 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'],
        ['red', 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg'],
        ['blue', 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-md']
    ])

    const sizeStyle: Map<string, string> = new Map([
        ['sm', 'px-3 py-1.5 text-sm'],
        ['md', 'px-4 py-2 text-base'],
        ['lg', 'px-6 py-3 text-lg']
    ])

    return (
        <button
            className={`${baseStyle} ${varientStyle.get(varient)} ${sizeStyle.get(size)} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button