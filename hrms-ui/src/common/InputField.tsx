import React, { forwardRef } from 'react'
import type { InputFieldPropsType } from '../types/InputFieldPropsType'

function InputField({label, error, className='', ...props}:InputFieldPropsType) {
  return (
    <div className='w-full'>
            {label && (
                <label className='block text-sm font-medium mb-1'>{label}</label>
            )}

            <input
                className={`w-full px-4 py-2 border-2 rounded-lg border-inherit ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                {... props}
            />
            {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
        </div>
  )
}

export default InputField