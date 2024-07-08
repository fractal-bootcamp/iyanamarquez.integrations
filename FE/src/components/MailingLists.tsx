import { useEffect, useState } from 'react'
import MailListItem from './MailListItem'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';

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
        <div className=" py-16 sm:py-24 lg:py-32 bg-pink-100 p-4 flex flex-wrap">

            <div className=" p-4 bg-white rounded-md shadow-md m-4">
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
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                        type="button"
                        onClick={handleAddEmail}
                    >
                        Add Email
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Mailing Lists</h1>
                {console.log('mailingListsData hereeee: ', mailingListsData)
                }
                {mailingListsData.map((mailingList: any, index: any) => (
                    <MailListItem key={index} name={mailingList.name} recipients={mailingList.recipients} />
                ))}
                {/* <MailListItem /> */}

            </div>

        </div>
    )
}
