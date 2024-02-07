import Err from '@/components/global/Err'
import SubmitButton from '@/components/global/SubmitButton'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useGlobalStore from '@/lib/state/globalStore'
import useAgentDeductionStore from '@/lib/state/super-admin/AgentDeductionStore'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AgentDeductions } from '@prisma/client'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    deduction: AgentDeductions
    agentID: string
}

const DeleteDeductionAlert = ({ deduction, agentID }: Props) => {

    const [open, setOpen] = useState(false)
    const { getAgentDeductions } = useAgentDeductionStore()
    const { setIsLoading, setErr } = useGlobalStore()

    const deleteDeduction = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            const { data } = await axios.delete('/api/agent/balance/deductions', { params: { deductionID: deduction.id } })

            if (data.ok) {
                getAgentDeductions(agentID)
                setIsLoading(false)
                toast("Success! deduction deleted.")
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
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <li className='flex hover:text-foreground justify-between items-center cursor-pointer'>
                    {tt('delete')}
                    <FontAwesomeIcon icon={faTrashCan} width={16} height={16} />
                </li>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("agent.deduction.delete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Err />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='font-bold text-sm flex flex-col gap-2 p-5 border'>
                        <div>ID: <span className='font-normal text-muted-foreground'>{deduction.id}</span></div>
                        <div>{tt('name')}: <span className='font-normal text-muted-foreground'>{deduction.name}</span></div>
                    </div>
                </div>
                <div className='flex items-center w-full justify-end gap-5'>
                    <Button onClick={() => setOpen(false)} variant={'ghost'}>{tt('close')}</Button>
                    <form onSubmit={deleteDeduction}>
                        <SubmitButton variant={'destructive'} msg={tt('confirm')} />
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteDeductionAlert