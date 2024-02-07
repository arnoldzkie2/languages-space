/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useDepartmentStore from "@/lib/state/super-admin/departmentStore";
import { ADMIN, SUPERADMIN } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const Departments = () => {

    const { departments, getDepartments, setDepartmentID, departmentID } = useDepartmentStore()
    const session = useSession()

    useEffect(() => {
        if (session.status === 'authenticated' && session.data.user.type === SUPERADMIN) {
            setDepartmentID('')
            if (!departments) getDepartments()
        }
    }, [session])

    const t = useTranslations('super-admin')

    if (session.data?.user.type === ADMIN) return null

    return (
        <Select onValueChange={deptID => deptID === 'all' ? setDepartmentID('') : setDepartmentID(deptID)} value={departmentID}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('global.department.select-department')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t('global.department.select')}</SelectLabel>
                    <SelectItem value="all">{t('global.department.all')}</SelectItem>
                    {departments && departments.length > 0 ? departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))
                        : null}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default Departments;
