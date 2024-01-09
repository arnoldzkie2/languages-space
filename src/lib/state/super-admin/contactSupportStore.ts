import { create } from 'zustand'

interface ContactSupportStore {
    contactSupport: boolean
    toggleContactSupport: () => void
    contactSupportFormData: {
        email: string
        type: string
        userID: string
        msg: string
    }
    setContactSupportFormData: (data: {
        email: string;
        type: string;
        userID: string;
        msg: string;
    }) => void
}

const useContactSupportStore = create<ContactSupportStore>((set, get) => ({
    contactSupport: false,
    contactSupportFormData: {
        email: '', type: '', userID: '', msg: ''
    },
    toggleContactSupport: () => set(state => ({ contactSupport: !state.contactSupport })),
    setContactSupportFormData: (data: {
        email: string
        type: string
        userID: string
        msg: string
    }) => set({ contactSupportFormData: data }),
}))

export default useContactSupportStore