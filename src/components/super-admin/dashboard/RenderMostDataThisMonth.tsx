import { DashboardDataProps } from '@/app/api/overview/route'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import React from 'react'

interface Props {
    data: DashboardDataProps
    mostDataSkeleton: React.JSX.Element
}

const RenderMostDataThisMonth = ({ data, mostDataSkeleton }: Props) => {

    const { clientMostBookings, supplierMostBookings, mostCardSold, agentMostInvites } = data.mostData.thisMonth

    const t = useTranslations()
    return (
        <div className='w-1/4 h-full'>
            <Card>
                <CardHeader>
                    <CardTitle>{t("statistics.month.this")}</CardTitle>
                    <CardDescription>{t('statistics.most_data.now')}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>

                    <div className='flex flex-col gap-2.5'>
                        <Label>{t('dashboard.most_data.client')}</Label>
                        {clientMostBookings ? <div className='flex items-center gap-4'>
                            <Avatar className='border'>
                                <AvatarImage src={clientMostBookings.profile_url || ''} alt='Client Profile' />
                                <AvatarFallback>{clientMostBookings.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col w-full'>
                                <Label>{clientMostBookings.username}</Label>
                                <div className='flex items-center justify-between w-full'>
                                    <small className='text-muted-foreground'>{clientMostBookings.email || 'noemail@nodata'}</small>
                                    <small>{t('pagination.total')}: {clientMostBookings.total_bookings}</small>
                                </div>
                            </div>
                        </div> : mostDataSkeleton}
                    </div>

                    <Separator orientation='horizontal' />
                    <div className='flex flex-col gap-2.5'>
                        <Label>{t('dashboard.most_data.supplier')}</Label>
                        {supplierMostBookings ? <div className='flex items-center gap-4'>
                            <Avatar className='border'>
                                <AvatarImage src={supplierMostBookings.profile_url || ''} alt='Client Profile' />
                                <AvatarFallback>{supplierMostBookings.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col w-full'>
                                <Label>{supplierMostBookings.username}</Label>
                                <div className='flex items-center justify-between w-full'>
                                    <small className='text-muted-foreground'>{supplierMostBookings.email || 'noemail@nodata'}</small>
                                    <small>{t('pagination.total')}: {supplierMostBookings.total_bookings}</small>
                                </div>
                            </div>
                        </div> : mostDataSkeleton}
                    </div>
                    <Separator orientation='horizontal' />
                    <div className='flex flex-col gap-2.5'>
                        <Label>{t("dashboard.most_data.agent")}</Label>
                        {agentMostInvites ? <div className='flex items-center gap-4'>
                            <Avatar className='border'>
                                <AvatarImage src={agentMostInvites.profile_url || ''} alt='Client Profile' />
                                <AvatarFallback>{agentMostInvites.username.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col w-full'>
                                <Label>{agentMostInvites.username}</Label>
                                <div className='flex items-center justify-between w-full'>
                                    <small className='text-muted-foreground'>{agentMostInvites.email || 'noemail@nodata'}</small>
                                    <small>{t('pagination.total')}: {agentMostInvites.total_invites}</small>
                                </div>
                            </div>
                        </div> : mostDataSkeleton}
                    </div>
                    <Separator orientation='horizontal' />
                    <div className='flex flex-col gap-2 w-full'>
                        <Label>{t('dashboard.most_data.card')}</Label>
                        {mostCardSold ? <div className='flex items-center gap-4'>
                            <Avatar className='border'>
                                <AvatarImage src={''} alt='Client Profile' />
                                <AvatarFallback>{mostCardSold.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col w-full'>
                                <Label>{mostCardSold.name}</Label>
                                <div className='flex items-center justify-between w-full'>
                                    <div className='flex items-center space-x-2 h-5 text-sm'>
                                        <small className='text-muted-foreground'>{t('card.price')}: CN¥{mostCardSold.price}</small>
                                        <Separator orientation='vertical' />
                                        <small className='text-muted-foreground'>{t('balance.h1')}: {mostCardSold.balance}</small>
                                        <Separator orientation='vertical' />
                                        <small className='text-muted-foreground'>{t('card.validity')}: {mostCardSold.validity}</small>
                                    </div>
                                    <small>{t('card.sold')}: {mostCardSold.sold}</small>
                                </div>
                            </div>
                        </div> : mostDataSkeleton}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default RenderMostDataThisMonth