import axios from "axios";
import { DepartmentsProps } from "../redux/GlobalState/Types";

const getAllDepartment = async () => {

    try {

        const { data } = await axios.get('/api/department')

        if (data.success) {

            return data.data as DepartmentsProps[]

        }

        alert('Something went wrong')

    } catch (error) {

        console.log(error);
    }
}

export { getAllDepartment }