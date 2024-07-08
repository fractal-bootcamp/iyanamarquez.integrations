import { useState } from "react";

const EmailForm = () => {
    const [emailDetails, setEmailDetails] = useState({
        to: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(emailDetails)
    }

    return <div>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">To email</label>
                <input type="email" id="email" name="to" value={emailDetails.to} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
            </div>
            <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                <textarea id="message" name="message" value={emailDetails.message} onChange={(e) => setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Send message</button>
        </form>

        to:{emailDetails.to}
        <br></br>
        message: {emailDetails.message}
    </div>;
}

export default EmailForm;