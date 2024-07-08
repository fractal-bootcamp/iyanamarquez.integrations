import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return <div>
        <nav className=" w-screen p-4 flex justify-start items-center gap-4" >
            <div className=" ">

                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <div>
                <Link to="/">Dashboard</Link>
            </div>
            <div>
                <Link to="/example">Mailing List</Link>
            </div>
            <div>
                <Link to="/email-composer">Email composer</Link>
            </div>
        </nav>
    </div>;
};

export default Navbar;