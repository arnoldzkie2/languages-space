import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslations } from "next-intl";

interface Props {
    tables: any
    selectedTable: any
}

const DownloadTable: React.FC<Props> = ({ tables, selectedTable }) => {

    const downloadTable = () => {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedTable.length > 0 ? selectedTable : tables);

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tables');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const excelData: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        saveAs(excelData, 'tables.xlsx');

    };

    const t = useTranslations('super-admin')

    return (
        <li className="flex items-center hover:text-blue-600 cursor-pointer justify-center w-28 text-gray-600" onClick={downloadTable}>
            <div>{t('global.download')}</div>
        </li>
    );
};

export default DownloadTable;
