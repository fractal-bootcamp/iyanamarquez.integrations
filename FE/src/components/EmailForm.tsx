import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CharacterCounter from "./CharacterCounter";


const URL = import.meta.env.VITE_REACT_APP_API_URL;

const EmailForm = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const [emailDetails, setEmailDetails] = useState({
        mailList: '',
        subject: '',
        message: '',
    })
    const { getToken } = useAuth();
    const [mailingListsData, setMailingListsData] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const sendBlast = async () => {
            axios.post(`${URL}/api/blast/createBlast`, { emailDetails }, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            })
                .then(response => {
                    navigate('/'); // Redirect to the success page

                })
                .catch(error => {
                    console.error('There was an error sending the email:', error);
                });
        }
        sendBlast()
        setEmailDetails({
            ...emailDetails,
            subject: '',
            message: '',
        })
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



    return <div className=" p-6">
        <form className="" onSubmit={handleSubmit}>
            <section className="">
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md bg-white rounded-xl bg-gradient-to-r from-violet-200 to-pink-200">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 ">Email Blast Form</h2>
                    <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">Send a blast to all members of a mailing list.</p>

                    <div className="mb-5">
                        <label htmlFor="mailList" className="block mb-2 text-sm font-medium text-gray-900">Mailing List</label>
                        <select onChange={handleChange} name="mailList" id="mailList" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="" disabled selected>Select a list</option>
                            {mailingListsData.map((mailingList, index) => (
                                <option key={index} value={mailingList.id}>{mailingList.name}</option>
                            ))}
                        </select> </div>
                    <div className="mb-5">
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                        <input type="text" name="subject" value={emailDetails.subject} onChange={(e) => setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })} id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 " placeholder="write your subject here" required />
                    </div>
                    <div className="sm:col-span-2 mb-5">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                        <textarea id="message" maxLength={280} name="message" value={emailDetails.message} onChange={(e) => setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value })} rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="write your message here"></textarea>
                    </div>
                    <CharacterCounter newcontent={emailDetails.message} />
                    <button type="submit" className=" py-3 px-5 text-sm font-medium text-center text-black rounded-lg bg-pink-100 sm:w-fit hover:bg-pink-200 focus:ring-4 focus:outline-none focus:ring-primary-300">Send message</button>
                </div>
            </section>
        </form>
    </div>;
}

export default EmailForm;