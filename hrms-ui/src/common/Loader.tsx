import { Spinner } from 'flowbite-react'

function Loader() {
    return (
        <div className='fixed inset-0 z-9999 flex justify-center items-center backdrop-blur-xs'>
            <Spinner size='xl' />
        </div>
    )
}

export default Loader