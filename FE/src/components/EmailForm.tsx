import { useState } from "react";
import axios from 'axios';


const EmailForm = () => {
    const [emailDetails, setEmailDetails] = useState({
        mailList: '',
        message: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        axios.post("http://localhost:3000/sendmail", emailDetails)
            .then(response => {
                console.log('Email sent successfully:', response.data);
            })
            .catch(error => {
                console.error('There was an error sending the email:', error);
            });
        console.log(emailDetails)
    }

    return <div className="bg-blue-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Send an email</h1>
        <form className="max-w-md mx-auto " onSubmit={handleSubmit}>
            <div className="mb-5">
                <label htmlFor="mailList" className="block mb-2 text-sm font-medium text-gray-900">Select your mailing list</label>
                <select onChange={handleChange} name="mailList" id="mailList" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="" disabled selected>Select a list</option>

                    <option>List1</option>
                    <option>List2</option>
                    <option>List3</option>
                    <option>List4</option>
                </select> </div>
            <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                <textarea id="message" name="message" value={emailDetails.message} onChange={(e) => setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
            </div>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Send message</button>
        </form>
        example
        <br></br>        to:{emailDetails.mailList}
        <br></br>
        message: {emailDetails.message}
    </div>;
}

export default EmailForm;