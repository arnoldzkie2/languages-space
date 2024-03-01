import { create } from 'zustand'
import useGlobalStore from '../globalStore';
import axios from 'axios';
import { toast } from 'sonner';
import { BookingCommentTemplates } from '@prisma/client';
import { TotalProps } from '@/lib/types/super-admin/globalType';
import { totalClientsValue } from './clientStore';

interface TemplateFormData {
    gender: string;
    user: string;
    message: string;
}

interface Props {
    templateFormData: TemplateFormData
    setTemplateFormData: (data: TemplateFormData) => void
    createTemplate: (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>
    templates: BookingCommentTemplates[]
    selectedTemplates: BookingCommentTemplates[]
    setSelectedTemplates: (newSelectedTemplates: BookingCommentTemplates[]) => void
    getAllTemplates: () => Promise<void>
    getSingleTemplate: (templateID: string) => Promise<void>
    updateTemplates: (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>, templateID: string) => Promise<void>
    totalTemplates: TotalProps
    setTotalTemplates: (total: TotalProps) => void
}

const useCommentTemplateStore = create<Props>((set, get) => ({
    templateFormData: { gender: '', user: '', message: '' },
    setTemplateFormData: (data: TemplateFormData) => set({ templateFormData: data }),
    templates: [],
    getAllTemplates: async () => {
        try {

            const { data } = await axios.get('/api/booking/comments/template')
            if (data.ok) set({ templates: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    getSingleTemplate: async (templateID: string) => {
        try {

            const { data } = await axios.get('/api/booking/comments/template', {
                params: { templateID }
            })
            if (data.ok) set({ templateFormData: data.data })

        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        }
    },
    createTemplate: async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {

        const { setErr, setIsLoading } = useGlobalStore.getState()

        e.preventDefault()

        const { templateFormData, getAllTemplates, setTemplateFormData } = get()
        const { gender, user, message } = templateFormData

        if (!gender) return setErr("Gender is required")
        if (!user) return setErr("User is required")
        if (!message) return setErr("Message is required")

        try {

            setIsLoading(true)
            const { data } = await axios.post('/api/booking/comments/template', templateFormData)

            if (data.ok) {
                getAllTemplates()
                setIsLoading(false)
                toast.success("Success! template created.")
                setOpen(false)
                setTemplateFormData({ gender: '', user: '', message: '' })
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    updateTemplates: async (e: React.FormEvent, setOpen: React.Dispatch<React.SetStateAction<boolean>>, templateID: string) => {

        const { setErr, setIsLoading } = useGlobalStore.getState()
        e.preventDefault()

        const { templateFormData, getAllTemplates, setTemplateFormData } = get()
        const { gender, user, message } = templateFormData

        if (!gender) return setErr("Gender is required")
        if (!user) return setErr("User is required")
        if (!message) return setErr("Message is required")

        try {

            setIsLoading(true)
            const { data } = await axios.patch("/api/booking/comments/template", templateFormData, {
                params: { templateID }
            })

            if (data.ok) {
                getAllTemplates()
                setIsLoading(false)
                toast.success("Success! template updated.")
                setOpen(false)
                setTemplateFormData({ gender: '', user: '', message: '' })
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    },
    totalTemplates: totalClientsValue,
    setTotalTemplates: (total: TotalProps) => set({ totalTemplates: total }),
    selectedTemplates: [],
    setSelectedTemplates: (newSelectedTemplates) => set({ selectedTemplates: newSelectedTemplates })
}))

export default useCommentTemplateStore