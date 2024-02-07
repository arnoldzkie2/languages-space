import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslations } from "next-intl";
import useAdminPageStore from '@/lib/state/admin/adminPageStore';

interface Props {
    msg?: string
    tables: any
    selectedTable: any
}

const DownloadTable: React.FC<Props> = ({ tables, selectedTable, msg }) => {

    const isAdminAllowed = useAdminPageStore(s => s.isAdminAllowed)

    const downloadTable = () => {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedTable.length > 0 ? selectedTable : tables);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tables');
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelData, 'tables.xlsx');
    };

    const t = useTranslations('super-admin')

    if (!isAdminAllowed('download_table')) return null

    return (
        <li className="flex items-center hover:text-primary cursor-pointer justify-center w-28 text-muted-foreground" onClick={downloadTable}>
            <div>{msg || t('global.download')}</div>
        </li>
    );
};

export default DownloadTable;
