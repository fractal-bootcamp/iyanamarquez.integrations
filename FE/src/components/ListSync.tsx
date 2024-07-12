import { useEffect, useState } from "react";
import { useAuth } from '@clerk/clerk-react';
import axios from "axios";

const ListSync = () => {
    const [tableData, setTableData] = useState<any>([]);
    const [selectedListId, setSelectedListId] = useState(null);
    console.log("selectedListId here ", selectedListId)
    const [mailingLists, setMailingLists] = useState<any[]>([]); // New state for mailing lists
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

    useEffect(() => {
        fetchAllMailingLists(); // Fetch mailing lists on component mount
    }, []);


    // Fetch all mailing lists
    const fetchAllMailingLists = async () => {
        try {
            const response = await axios.get(`${URL}/api/list/mailinglists`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            console.log("response", response.data)
            setMailingLists(response.data);
        } catch (error) {
            console.error('Error fetching mailing lists:', error);
        }
    };
    console.log("selectedListId is", selectedListId)
    const fetchCurrentMailingList = async () => {
        try {
            const response = await axios.get(`${URL}/api/list/mailinglists/${selectedListId}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            console.log('brh that the eck')
            console.log("response", response.data)
            setTableData(response.data.recipients);
        } catch (error) {
            console.error('Error fetching mailing lists:', error);
        }
    }
    // Add new email to grist table
    const syncLists = async () => {
        try {
            await axios.get(`${URL}/api/list/synctable/${selectedListId}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            fetchCurrentMailingList();
        } catch (error) {
            console.error('Error syncing lists:', error);
        }
    };

    return <div>
        <h1 className="text-2xl font-bold mb-4">Current list</h1>
        <div className="border shadow-md p-4 rounded-md m-2">
            <h1>Select Mailing List</h1>
            <select onChange={(e) => setSelectedListId(e.target.value)} className="mb-4">
                <option value="">Select a list</option>
                {mailingLists.map((list) => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                ))}
            </select>


            <button type="button" onClick={fetchCurrentMailingList} className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">get</button>
            <button type="button" onClick={syncLists} className="bg-pink-500 text-white px-4 py-2 rounded-md mx-2">Sync</button>
        </div>
        <div className="flex flex-col mt-5">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((data: { id: any; email: any; name: any; }) => (
                                    <tr key={data.id} className="odd:bg-white even:bg-gray-100 ">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{data.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{data.name}</td>
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