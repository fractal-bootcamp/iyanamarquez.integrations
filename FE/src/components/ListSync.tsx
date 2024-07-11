import { useEffect, useState } from "react";
import { useAuth } from '@clerk/clerk-react';
import axios from "axios";


const ListSync = () => {
    const [tableData, setTableData] = useState<any>([]);
    const [selectedList, setSelectedList] = useState(null);
    // fetch list from BE
    const URL = import.meta.env.VITE_REACT_APP_API_URL;
    const { getToken } = useAuth();
    const tableName = "jwCdg4Ffpuag"
    const [input, setInput] = useState({
        name: '',
        email: ''
    });

    const handleInputChange = (value: string) => {
        setInput(value);
    }


    // fetch current table from grist
    const fetchLists = async () => {
        try {
            const response = await axios.get(`${URL}/gristtable/${tableName}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            })
            console.log("response", response.data.records)
            setTableData(response.data.records)
        } catch (error) {
            console.error('Error fetching mailing lists:', error)
        }
    }
    // useEffect(() => {
    //     fetchLists()
    // }, [])


    // add new email to grist table
    const updateList = async () => {
        try {
            const response = await axios.post(`${URL}/api/list/updateList`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                },
                data: { data: input }
            })
            console.log("response", response.data)
            setTableData(response.data)
        } catch (error) {
            console.error('Error updating list:', error)
        }
    }

    return <div>
        <h1 className="text-2xl font-bold mb-4">Current list</h1>
        <div className="border shadow-md p-4 rounded-md m-2">

            <h1>Add new user</h1>
            <form>
                <input onChange={(e) => handleInputChange(e.target.value)} name="name" type="text" placeholder="name" />
                <input onChange={(e) => handleInputChange(e.target.value)} name="email" type="text" placeholder="email" />
                <button type="submit" onClick={updateList} className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">Add</button>
                <button type="button" onClick={fetchLists} className="bg-pink-500 text-white px-4 py-2 rounded-md mx-2">Sync</button>

            </form>
        </div>
        <div className="flex flex-col mt-5">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>

                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((data: any) => (
                                    <tr key={data.id} className="odd:bg-white even:bg-gray-100 ">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{data.fields.A}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{data.fields.B}</td>
                                    </tr>))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>;
};

export default ListSync;