import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import EmailForm from './components/EmailForm.tsx';
import MailingLists from './components/MailingLists.tsx';
import Navbar from './components/Navbar.tsx';
import Layout from './Layout.tsx';
import MailListView from './components/MailListView.tsx';
import Tiptap from './components/Tiptap.tsx';
import CharacterCounter from './components/CharacterCounter.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout here
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/composeemail",
        element: <EmailForm />,
      },
      {
        path: "/viewlists",
        element: <MailingLists />,
      },
      {
        path: "/viewlist/:id",
        element: <MailListView />,
      },
      {
        path: "/tiptap",
        element: <Tiptap />,
      },
      {
        path: "/tiptap2",
        element: <CharacterCounter />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
)