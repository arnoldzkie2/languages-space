import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAdminAgentStore from '@/lib/state/super-admin/agentStore'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteSelectedAgentAlert = () => {

    const [open, setOpen] = useState(false)
    const { getAgents, selectedAgents, setSelectedAgents } = useAdminAgentStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteSelectedAdmins = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const adminIds = selectedAgents.map((agent) => agent.id);
            const queryString = adminIds.map((id) => `agentID=${encodeURIComponent(id)}`).join('&');

            const { data } = await axios.delete(`/api/agent?${queryString}`)

            if (data.ok) {
                getAgents()
                setSelectedAgents([])
                setIsLoading(false)
                toast("Success! agents deleted.")
                setOpen(false)
            }

        } catch (error: any) {
            setIsLoading(false)
            console.log(error);
            if (error.response.data.msg) {
                return setErr(error.response.data.msg)
            }
            alert("Something went wrong")
        }
    }

    const t = useTranslations("super-admin")
    const tt = useTranslations("global")

    if (selectedAgents.length < 1) return null

    return (
        <div className='p-3 border bg-card'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant={'destructive'}>{tt("delete-all")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("agent.delete")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <Err />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto'>
                        {selectedAgents.map(agent => (
                            <div className='font-bold text-sm flex flex-col gap-2 p-5 border' key={agent.id}>
                                <div>ID: <span className='font-normal text-muted-foreground'>{agent.id}</span></div>
                                <div>{tt('username')}: <span className='font-normal text-muted-foreground'>{agent.username}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center w-full justify-end gap-5'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                        <form onSubmit={deleteSelectedAdmins}>
                            <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                        </form>
                    </div>
                </AlertDialogContent>
            </AlertDialog >
        </div>
    )
}

export default DeleteSelectedAgentAlert