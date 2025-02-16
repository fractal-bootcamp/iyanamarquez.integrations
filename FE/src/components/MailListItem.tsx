import { Link } from "react-router-dom";

const MailListItem = (props: { name: string, recipients: string[], id: string }) => {
    return <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border border m-2">
        <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            <div role="button"
                className="flex items-center w-full p-3 py-1 pl-4 pr-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                <Link to={`/viewlist/${props.id}`}>
                    <h1 className="text-2xl font-bold mb-4 hover:text-blue-gray-9000 hover:underline">
                        {props.name}
                    </h1>
                </Link>
                <div>

                    <h2>Recipients</h2>
                    <ul className=" text-gray-700 ">
                        {props.recipients.map((recipient, index) => (
                            <li key={index} className="">
                                <a className=" hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">
                                    {recipient.email}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid ml-auto place-items-center justify-self-end">
                    <button
                        className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fill-rule="evenodd"
                                    d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

        </nav>
    </div>
}

export default MailListItem;