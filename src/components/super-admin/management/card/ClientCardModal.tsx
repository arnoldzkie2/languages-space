import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useAdminCardStore from '@/lib/state/super-admin/cardStore';
import { useTranslations } from 'next-intl';

const ClientCardModal: React.FC = () => {

    const { cardData, closeViewCard } = useAdminCardStore()

    const copy = (value: any) => {
        navigator.clipboard.writeText(value)
        alert(`Copied ${value}`)
    }

    const t = useTranslations('super-admin')

    return (

        <div className='fixed top-0 left-0 w-screen h-screen z-20 bg-gray-500 bg-opacity-60 grid place-items-center py-24 px-72'>
            <form className='w-1/2 h-full bg-white border shadow-lg rounded-2xl gap-10 p-10 relative flex'>
                <FontAwesomeIcon icon={faXmark} className='absolute right-5 top-5 text-2xl cursor-pointer' onClick={() => closeViewCard()} />
                <div className='flex flex-col w-2/3 h-full gap-3 justify-start'>
                    <label className='font-bold text-sm'>ID:</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.id} />

                    <label className='font-bold text-sm'>{t('client-card.name')}</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.name || 'No Data'} />

                    <label className='font-bold text-sm'>{t('client-card.price')}</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.price || 'No Data'} />

                    <label className='font-bold text-sm'>{t('client-card.balance')}</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.balance || 'No Data'} />

                    <label className='font-bold text-sm'>{t('client-card.validity')}</label>
                    <input readOnly type="text" className='text-sm mb-2 outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.validity || 'No Data'} />

                    <label className='font-bold text-sm'>{t('client-card.settlement_period')}</label>
                    <input readOnly type="text" className='text-sm outline-none border px-3 py-2 w-full cursor-pointer' onClick={(e: any) => copy(e.target.value)} value={cardData?.settlement_period} />
                    <div className='flex items-center justify-between w-2/3'>
                        <label className=''>{t('client-card.invoice')}</label>
                        <input readOnly type="checkbox" className=' outline-none border px-3 py-2 cursor-pointer' checked={cardData?.invoice} />
                    </div>
                    <div className='flex items-center justify-between w-2/3'>

                        <label className=''>{t('client-card.repeat_purchases')}</label>
                        <input readOnly type="checkbox" className=' outline-none border px-3 py-2 cursor-pointer' checked={cardData?.repeat_purchases} />
                    </div>

                    <div className='flex items-center justify-between w-2/3'>

                        <label className=''>{t('client-card.online_renews')}</label>
                        <input readOnly type="checkbox" className=' outline-none border px-3 py-2 cursor-pointer' checked={cardData?.online_renews} />
                    </div>

                    <div className='flex items-center justify-between w-2/3'>

                        <label className=''>{t('client-card.available')}</label>
                        <input readOnly type="checkbox" className=' outline-none border px-3 py-2 cursor-pointer' checked={cardData?.available} />
                    </div>

                </div>

            </form>
        </div>

    );
};

export default ClientCardModal;
