import { useEffect, useState } from 'react'
import MailListItem from './MailListItem'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function MailingLists() {
    // form data
    const [recipientsList, setRecipientsList] = useState<string[]>([]) // Define the type as string array
    const [newEmail, setNewEmail] = useState('')
    const [mailinglistName, setMailinglistName] = useState('')

    // data received from BE
    const [mailingListsData, setMailingListsData] = useState<any>([]);

    const { getToken, isLoaded, isSignedIn } = useAuth();


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
            await axios.post('http://localhost:3000/new/mailinglist',
                { 'mailinglistName': mailinglistName, 'recipientsList': recipientsList },
                {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    }
                }
            )
            // post request to /newmaillist
            console.log({ 'mailinglistName': mailinglistName, 'recipientsList': recipientsList })
            // TODO: clear the form
            setRecipientsList([])
            setNewEmail('')
            setMailinglistName('')
            // TODO: redirect to view list page

            console.log('Form submitted')
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    useEffect(() => {
        const fetchMailingLists = async () => {
            try {
                const response = await axios.get('http://localhost:3000/mailinglists', {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    }
                })
                console.log('Mailing lists issss:', response.data)
                setMailingListsData(response.data)
            } catch (error) {
                console.error('Error fetching mailing lists:', error)
            }
        }
        fetchMailingLists()
    }, []);

    console.log('recipientsList: ', recipientsList)

    return (
        <div className="p-6 flex flex-col ">

            <div className=" p-4 bg-white rounded-md shadow-2xl mb-5 self-center md:w-1/2 bg-slate-100">
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
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
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

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 overflow-y-scroll h-[50vh] bg-gradient-to-r from-violet-200 to-pink-200">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900">All mailing lists</h5>
                    List total
                </div>
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200  rounded-xl ">
                        {mailingListsData.map((mailingList: any, index: any) => {
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
                                            <p className="text-sm text-gray-500 truncate">
                                                Click to view more                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                            <Link to={`/viewlist/${mailingList.id}`}>{mailingList.recipients.length}</Link>
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
