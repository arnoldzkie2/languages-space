'use client'
import React, { useEffect, useState } from 'react';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCalendarDays, faChartLine, faBuilding, faDisplay, faGear, faHouse, faNewspaper, faUser, faUserSecret, faUserShield, faUsers, faBook, faGlobe, faSpinner, faPersonChalkboard } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname, Link } from '@/lib/navigation';
import useGlobalStore from '@/lib/state/globalStore';
import ThemeToggle from '../global/DarkmodeToggle';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import useAdminPageStore from '@/lib/state/admin/adminPageStore';
import { AdminPermission } from '@prisma/client';
import { ADMIN, SUPERADMIN } from '@/utils/constants';
import { IconDefinition, faCreditCard } from '@fortawesome/free-regular-svg-icons';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import useDepartmentStore from '@/lib/state/super-admin/departmentStore';

interface LinkItem {
    key: string;
    permission: keyof AdminPermission;
    icon: IconDefinition;
    path: string;
    label: string;
}

const links: LinkItem[] = [
    { key: 'agent', permission: 'view_agent', icon: faUserSecret, path: '/admin/manage/agent', label: 'side-nav.agent' },
    { key: 'client', permission: 'view_client', icon: faUser, path: '/admin/manage/client', label: 'side-nav.client' },
    { key: 'supplier', permission: 'view_supplier', icon: faUsers, path: '/admin/manage/supplier', label: 'side-nav.supplier' },
    { key: 'booking', permission: 'view_booking', icon: faBook, path: '/admin/manage/booking', label: 'side-nav.booking' },
    { key: 'card', permission: 'view_cards', icon: faCreditCard, path: '/admin/manage/card', label: 'side-nav.card' },
    { key: 'schedule', permission: 'view_supplier_schedule', icon: faCalendarDays, path: '/admin/manage/schedule', label: 'side-nav.schedule' },
    { key: 'course', permission: 'view_courses', icon: faPersonChalkboard, path: '/admin/manage/course', label: 'side-nav.course' },
    { key: 'news', permission: 'view_news', icon: faDisplay, path: '/admin/manage/news', label: 'side-nav.news' },
    { key: 'orders', permission: 'view_orders', icon: faNewspaper, path: '/admin/manage/orders', label: 'side-nav.orders' },
    { key: 'statistics', permission: 'view_statistics', icon: faChartLine, path: '/admin/manage/statistics', label: 'side-nav.statistics' },
    { key: 'settings', permission: 'handle_settings', icon: faGear, path: '/admin/manage/settings', label: 'side-nav.settings' },
];

const SideNav: React.FC = () => {

    const router = useRouter()

    const { permissions, getAdminDepartments, setAdmin, adminDepartments } = useAdminPageStore()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })

    const renderLink = (link: LinkItem) => {
        const hasPermission = session?.user.type === SUPERADMIN || (session?.user?.type === ADMIN && permissions && permissions?.[link.permission]);
        if (!hasPermission) return null

        return (
            <Link onClick={() => setPage(link.key)} href={link.path} className={`flex text-sm border-b ${page === link.key ? 'text-primary border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'} pb-2 items-center outline-none w-full`} key={link.key}>
                {isSideNavOpen && <span className='mr-auto'>{t(link.label)}</span>}
                <FontAwesomeIcon width={16} height={16} icon={link.icon} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[16px] h-[16px]'}`} />
            </Link>
        );
    };

    const { toggleSideNav, isSideNavOpen, locales, page, setPage } = useGlobalStore()

    const t = useTranslations('super-admin')
    const tt = useTranslations('global')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredSideNav = links.filter(obj => obj.key.toUpperCase().includes(searchQuery.toUpperCase()))

    const pathname = usePathname()

    const handleTranslation = (locale: string) => {
        router.replace(pathname, { locale })
    }

    useEffect(() => {

        if (status === 'authenticated' && session.user.type === ADMIN) {
            setAdmin(session.user)
            if (!adminDepartments) {
                setPage('dashboard')
                router.push('/admin')
                getAdminDepartments()
            }
        } else if (status === 'authenticated' && session.user.type !== SUPERADMIN) {
            signOut()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    return (
        <>
            <nav className={`border-r ${isSideNavOpen ? 'w-44 p-5' : 'w-16 py-6'} fixed h-screen flex flex-col`}>

                <div className='w-full flex items-center justify-center gap-5 relative'>
                    {isSideNavOpen && <Input placeholder={tt('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />}
                    <FontAwesomeIcon icon={isSideNavOpen ? faArrowLeft : faArrowRight} width={16} height={16}
                        title={t('side-nav.menu')}
                        className={`${isSideNavOpen ? 'absolute right-0 bg-primary rounded-r-md p-2.5 text-white' : 'w-full pb-6 hover:text-primary border-b'} cursor-pointer text-muted-foreground`}
                        onClick={toggleSideNav} />
                </div>
                <ul className='flex flex-col items-center gap-5 pt-4 h-full'>
                    {session?.user.type === ADMIN && <AdminDepartmentSelect />}
                    <Link onClick={() => setPage('dashboard')} href={'/admin'}
                        className={`flex text-sm border-b ${page === 'dashboard' ? 'text-primary border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
                         pb-2 items-center outline-none w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.dashboard')}</span>}
                        <FontAwesomeIcon width={16} height={16} icon={faHouse} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[16px] h-[16px]'}`} />
                    </Link>
                    {session?.user.type === SUPERADMIN && <Link onClick={() => setPage('department')} href={'/admin/manage/department'}
                        className={`flex text-sm border-b ${page === 'department' ? 'text-primary border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
                        pb-2 items-center outline-none w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.department')}</span>}
                        <FontAwesomeIcon width={16} height={16} icon={faBuilding} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[16px] h-[16px]'}`} />
                    </Link>}
                    {session?.user.type === SUPERADMIN && <Link onClick={() => setPage('admin')} href={'/admin/manage/admin'}
                        className={`flex text-sm border-b ${page === 'admin' ? 'text-primary border-primary' : 'text-muted-foreground hover:text-primary hover:border-primary'}
                                  pb-2 items-center outline-none w-full`}>
                        {isSideNavOpen && <span className='mr-auto'>{t('side-nav.admin')}</span>}
                        <FontAwesomeIcon width={16} height={16} icon={faUserShield} className={`${!isSideNavOpen && 'ml-auto mr-auto w-[16px] h-[16px]'}`} />
                    </Link>}
                    {filteredSideNav.map(renderLink)}
                    <div className={`flex items-center w-full ${isSideNavOpen ? 'justify-around' : 'flex-col gap-5'}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <FontAwesomeIcon icon={faGlobe} width={16} height={16} className='cursor-pointer' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {locales.map((locale, i) => (
                                    <DropdownMenuItem onClick={() => handleTranslation(locale.loc)} key={i}>
                                        {locale.val}
                                    </DropdownMenuItem>
                                ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ThemeToggle />
                    </div>
                </ul>
                <Logout />
            </nav >
            {
                status !== 'authenticated' && <div className='h-screen w-screen grid fixed top-0 left-0 place-content-center backdrop-blur bg-opacity-30 z-50'>
                    <FontAwesomeIcon icon={faSpinner} width={30} height={30} className='animate-spin w-[30px] h-[30px]' />
                </div>
            }
        </>
    );
};

const AdminDepartmentSelect = () => {

    const t = useTranslations('super-admin')
    const { adminDepartments, getPermissions, permissions } = useAdminPageStore()
    const isSideNavOpen = useGlobalStore(s => s.isSideNavOpen)
    const { setDepartmentID, departmentID } = useDepartmentStore()
    const router = useRouter()
    const setPage = useGlobalStore(s => s.setPage)

    useEffect(() => {
        if (adminDepartments && adminDepartments.length === 1 && !permissions) {
            getPermissions(adminDepartments[0].department.id)
            setDepartmentID(adminDepartments[0].department.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminDepartments])

    if (!adminDepartments || adminDepartments.length === 1) return null

    return (
        <div className='w-full flex justify-center'>
            {isSideNavOpen ?
                <Select onValueChange={(deptID) => {
                    setPage('dashboard')
                    router.push('/admin')
                    setDepartmentID(deptID)
                    getPermissions(deptID)
                }} value={departmentID}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('global.department.select-department')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('side-nav.department')}</SelectLabel>
                            {adminDepartments && adminDepartments.length > 1 ? adminDepartments.map(dept => (
                                <SelectItem key={dept.department.id} value={dept.department.id}>{dept.department.name}</SelectItem>
                            )) : null}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                :
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <FontAwesomeIcon icon={faBuilding} width={16} height={16} className='cursor-pointer' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {adminDepartments && adminDepartments.length > 1 && adminDepartments.map((dept) => (
                            <DropdownMenuItem onClick={() => {
                                setPage('dashboard')
                                setDepartmentID(dept.department.id)
                                getPermissions(dept.department.id)
                                router.push('/admin')
                            }} key={dept.department.id}>
                                {dept.department.name}
                            </DropdownMenuItem>
                        ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </div>

    )
}

export default SideNav;
