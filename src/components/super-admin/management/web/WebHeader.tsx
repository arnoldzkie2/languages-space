import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import DownloadTable from '../DownloadTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/Store';

const WebHeader: React.FC = ({ }) => {

    const { news, selectedNews } = useSelector((state: RootState) => state.manageWeb)

    return (
        <nav className={`border shadow flex items-center py-5 px-10 justify-between`}>
            <h1 className='font-bold text-gray-600 text-xl'>MANAGE NEWS</h1>
            <ul className='flex items-center h-full ml-auto gap-10'>
                <Link href='/manage/web/create-news' className='flex items-center text-gray-700 hover:text-blue-600 cursor-pointer gap-1'>
                    <div>Create News</div>
                    <FontAwesomeIcon icon={faPlus} />
                </Link>
                <DownloadTable tables={news} selectedTable={selectedNews} />
            </ul>
        </nav>
    )
}

export default WebHeader;
