import ClientTable from '@/components/super-admin/management/client/ClientTable';
import SideNav from '@/components/super-admin/SideNav';
import axios from 'axios';

const getAllDepartment = async () => {

    const { data }: ClientsTableProps = await axios.get('http://localhost:3000/api/department')
    
    console.log(data);

    return data
}

interface ClientsTableProps {
    data: {
        id: string
        name: string
        date: string
    }[]
}

const Page = async () => {

    const data = await getAllDepartment()

    return (
        <div className='flex'>
            <SideNav />

            <ClientTable data={data} />
        </div>
    );
};

export default Page;
