import { RootState } from "@/lib/redux/Store";
import { useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
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

    const t = useTranslations('global')

    return (
        <li className="flex items-center gap-1 hover:text-blue-600 cursor-pointer text-gray-600" onClick={downloadTable}>
            <div>{t('download')}</div>
            <FontAwesomeIcon icon={faFloppyDisk} />
        </li>
    );
};

export default DownloadTable;
