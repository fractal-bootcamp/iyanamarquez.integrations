import { useEffect, useState } from 'react'
import MailListItem from './MailListItem'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // Import useNavigate



export default function MailingLists() {
    // form data
    const [recipientsList, setRecipientsList] = useState<string[]>([]) // Define the type as string array
    const [newEmail, setNewEmail] = useState('')
    const [mailinglistName, setMailinglistName] = useState('')

    // data received from BE
    const [mailingListsData, setMailingListsData] = useState<any>([]);

    const { getToken, isLoaded, isSignedIn } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate
    const URL = import.meta.env.VITE_REACT_APP_API_URL;


    const handleNewEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value)
    }

    const handleAddEmail = () => {
        if (newEmail.trim() !== '') {
            setRecipientsList([...recipientsList, newEmail])
            setNewEmail('')
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            await axios.post(`${URL}/api/list/new/mailinglist`,
                { 'mailinglistName': mailinglistName, 'recipientsList': recipientsList },
                {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    }
                }
            )
            // post request to /newmaillist
            // TODO: clear the form
            setRecipientsList([])
            setNewEmail('')
            setMailinglistName('')
            // TODO: redirect to view list page

        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    const handleDeleteMailingList = async (event: React.FormEvent<HTMLFormElement>, mailingListId: string) => {
        event.preventDefault()
        try {
            await axios.delete(`${URL}/api/list/delete/mailinglist/${mailingListId}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            }).then((response) => {
                navigate(0)

            })
        } catch (error) {
            console.error('Error deleting mailing list:', error)
        }
    }

    useEffect(() => {
        const fetchMailingLists = async () => {
            try {
                const response = await axios.get(`${URL}/api/list/mailinglists`, {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    }
                })
                setMailingListsData(response.data)
            } catch (error) {
                console.error('Error fetching mailing lists:', error)
            }
        }
        fetchMailingLists()
    }, []);


    return (
        <div className="p-6 flex flex-col ">

            <div className=" p-4 bg-white rounded-md mb-5 md:w-1/2 border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Create New Mailing List</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="listName">
                            List Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="listName"
                            type="text"
                            placeholder="Enter list name"
                            value={mailinglistName}
                            onChange={(e) => setMailinglistName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newEmail">
                            Add Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="newEmail"
                            type="email"
                            placeholder="Enter email"
                            value={newEmail}
                            onChange={handleNewEmailChange}
                        />
                    </div>
                    <button
                        className="mr-2 bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                        type="button"
                        onClick={handleAddEmail}
                    >
                        Add Email
                    </button>
                    <button
                        className="bg-purple-400 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Create List
                    </button>
                </form>
                <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">Emails:</h3>
                    <ul className="list-disc pl-5">
                        {recipientsList.map((email, index) => (
                            <li key={index} className="text-gray-700">{email}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg sm:p-8 overflow-y-scroll ">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900">All mailing lists</h5>
                    List total
                </div>
                <div className="flow-root bg-gradient-to-r from-violet-200 to-pink-200 h-[30vh]">
                    <ul role="list" className="divide-y divide-gray-200  rounded-xl ">
                        {mailingListsData.map((mailingList: any) => {
                            return (
                                <li className="bg-white m-2 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image" />
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {mailingList.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate hover:underline">
                                                <Link to={`/viewlist/${mailingList.id}`}>Click to view more</Link>
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                            <DeleteIcon onClick={(e) => handleDeleteMailingList(e, mailingList.id)} />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>

    )
}
