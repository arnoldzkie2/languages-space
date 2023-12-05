/* eslint-disable react-hooks/exhaustive-deps */
import ClientCards from '@/components/client/ClientCards'
import ClientHeader from '@/components/client/ClientHeader'
import ClientProfile from '@/components/client/ClientProfile'

const Page = () => {

    return (
        <>
            <ClientHeader />
            <div className='px-5 md:flex-row lg:justify-center text-gray-700 sm:px-10 md:px-16 lg:px-24 xl:px-36 2xl:px-44 flex flex-col gap-10 py-32'>
                <ClientProfile />
                <ClientCards />
            </div>
        </>

    )
}

export default Page