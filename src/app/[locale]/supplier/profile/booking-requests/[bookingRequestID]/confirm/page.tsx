'use client'
import { useRouter } from '@/lib/navigation'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
    params: {
        bookingRequestID: string
    }
}

const bookingRequestPath = '/supplier/profile/booking-requests'

const Page = ({ params }: Props) => {

    const router = useRouter()

    const confirmBookingRequest = async (bookingRequestID: string) => {
        try {

            const { data } = await axios.post('/api/booking/request/confirm', { bookingRequestID })

            if (data.ok) {
                toast("Success! booking request confirmed.")
                router.push(bookingRequestPath)
            }

        } catch (error: any) {
            console.log(error);
            if (error.response.data.msg) {
                alert(error.response.data.msg)
                router.push(bookingRequestPath)
            }
        }
    }

    useEffect(() => {

        if (!params.bookingRequestID) return router.push(bookingRequestPath)
        confirmBookingRequest(params.bookingRequestID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export default Page