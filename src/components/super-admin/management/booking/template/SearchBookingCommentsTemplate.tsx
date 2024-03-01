import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react'

interface Props {
  handleSearch: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void
  searchQuery: {
    message: string;
    user: string;
    gender: string;
  }
  setSearchQuery: React.Dispatch<React.SetStateAction<{
    message: string;
    user: string;
    gender: string;
  }>>
}

const SearchBookingCommentsTemplate = (props: Props) => {

  const { handleSearch, searchQuery, setSearchQuery } = props
  const t = useTranslations()
  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex justify-between items-center mb-2 font-medium px-2'>
        {t('booking.comments.template.search')}
      </div>
      <Input
        placeholder={t('info.message')}
        name='message'
        className='w-full border text-sm px-3 outline-none py-2'
        onChange={handleSearch}
        value={searchQuery.message}
      />

      <Select onValueChange={gender => gender === 'all' ? setSearchQuery(prev => ({ ...prev, gender: '' })) : setSearchQuery(prev => ({ ...prev, gender }))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('info.gender.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('info.gender.h1')}</SelectLabel>
            <SelectItem value="all">{t("info.gender.all")}</SelectItem>
            <SelectItem value="male">{t('info.gender.male')}</SelectItem>
            <SelectItem value="female">{t('info.gender.female')}</SelectItem>
            <SelectItem value="others">{t('info.gender.others')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      < Select onValueChange={user => user === 'all' ? setSearchQuery(prev => ({ ...prev, user: '' })) : setSearchQuery(prev => ({ ...prev, user }))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('operation.select_user')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('user.h1')}</SelectLabel>
            <SelectItem value="all">{t("user.all")}</SelectItem>
            <SelectItem value="client">{t('user.client')}</SelectItem>
            <SelectItem value="supplier">{t('user.supplier')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

    </div>
  )
}

export default SearchBookingCommentsTemplate