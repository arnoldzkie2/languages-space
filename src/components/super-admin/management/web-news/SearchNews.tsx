import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import useSettingsStore from '@/lib/state/super-admin/settingsStore';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

interface SearchNewsProps {
    searchQuery: {
        author: string
        title: string
        keywords: string
        created_at: string
        updated_at: string
    }

    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void

}

const SearchNews: React.FC<SearchNewsProps> = ({ handleSearch, searchQuery }) => {

    const t = useTranslations()

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)
    const { settings, getSettings, setSettings, updateSettings } = useSettingsStore()

    useEffect(() => {
        if (!settings) getSettings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className=''>
            <div className='flex justify-between items-center mb-2 font-medium'>
                {t('news.search')}
            </div>
            <div>
                <div className='flex flex-col gap-3'>

                    <Input type="text"
                        placeholder={t('info.title')}
                        name='title'
                        onChange={handleSearch}
                        value={searchQuery.title}
                    />

                    <Input type="text"
                        placeholder={t('news.author')}
                        name='author'
                        onChange={handleSearch}
                        value={searchQuery.author}
                    />

                    <Input type="text"
                        placeholder={t('news.keywords')}
                        name='keywords'
                        onChange={handleSearch}
                        value={searchQuery.keywords}
                    />

                    <Input type="text"
                        placeholder={t('info.date.h1')}
                        name='date'
                        onChange={handleSearch}
                        value={searchQuery.created_at}
                    />
                </div>
                {settings && isAdminAllowed('modify_published_news') && <div className='flex pt-3 flex-col gap-1.5'>
                    <Label>{t('news.to_publish')}</Label>
                    <div className='flex items-center w-full'>
                        <Input
                            value={settings.deploy_news}
                            type='number'
                            onChange={(e) => setSettings({ ...settings, deploy_news: Number(e.target.value) })} />
                        <Button onClick={(e) => updateSettings(e)}>{t("operation.save")}</Button>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default SearchNews;
