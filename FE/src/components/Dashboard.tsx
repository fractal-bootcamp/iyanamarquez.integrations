import { Link } from "react-router-dom";
import EmailForm from "./EmailForm";
import MailingLists from "./MailingLists";
import Example from "./MailingLists";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '@clerk/clerk-react';


const Dashboard = () => {
    const { getToken } = useAuth();
    const URL = import.meta.env.VITE_REACT_APP_API_URL;

    // TODO: get the lists from the backend
    const [emailBlasts, setEmailBlasts] = useState([]);
    useEffect(() => {

        const fetchEmailBlasts = async () => {
            try {
                const response = await axios.get(`${URL}/api/blast/getAllBlasts`, {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`
                    }
                })
                setEmailBlasts(response.data)
            } catch (error) {
                console.error('Error fetching mailing lists:', error)
            }
        }
        fetchEmailBlasts()
    }, []);

    return <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 border-b-2 border-gray-200 mb-5 bg-gradient-to-r from-violet-200 to-pink-200">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl ">Welcome to the dashboard</h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 ">Here is a lorem ipsum thingy dolor sit amet consectetur adipisicing elit. Corporis ad eaque accusantium itaque tempora maiores laborum atque, esse ipsum sit nihil. Vitae quidem laborum eligendi, debitis fugit deleniti dolores corrupti!.</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                <Link to="/viewlists" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-purple-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 ">
                    Create Mailing List <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
                <Link to="/composeemail" className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">
                    Create blast
                </Link>
            </div>
        </div>
        <div className="">
            <div className="relative overflow-x-auto overflow-y-auto h-[500px]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Blast Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Blast Subject
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mailing list
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {emailBlasts.map((blast) => (
                            <tr className="bg-white border-b ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {blast.subject}
                                </th>
                                <td className="px-6 py-4">
                                    {blast.body}
                                </td>
                                <td className="px-6 py-4 hover:underline">
                                    <Link to={`/viewlist/${blast.targetList.id}`}>
                                        {blast.targetList.name}
                                    </Link>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
};

export default Dashboard;