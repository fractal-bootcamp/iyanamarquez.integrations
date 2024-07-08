import { useState } from 'react'
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import EmailForm from './EmailForm'
import MailListItem from './MailListItem'
import { Link } from 'react-router-dom'

export default function MailingLists() {
    const [emails, setEmails] = useState<string[]>([]) // Define the type as string array
    const [newEmail, setNewEmail] = useState('')
    const [listName, setListName] = useState('')

    const handleNewEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value)
    }

    const handleAddEmail = () => {
        if (newEmail.trim() !== '') {
            setEmails([...emails, newEmail])
            setNewEmail('')
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // TODO: send data to backend
        // post request to /newmaillist
        console.log({ 'listName': listName, 'emails': emails })
        // TODO: clear the form
        setEmails([])
        setNewEmail('')
        setListName('')
        // TODO: redirect to view list page

        console.log('Form submitted')
    }

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
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
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
                        {emails.map((email, index) => (
                            <li key={index} className="text-gray-700">{email}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Mailing Lists</h1>

                <MailListItem />
                <MailListItem />
            </div>
        </div>
    )
}
