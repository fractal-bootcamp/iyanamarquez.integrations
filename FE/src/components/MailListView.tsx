import React, { useState } from 'react';

const MailListView = () => {
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState<string[]>([]);

    const handleAddEmail = () => {
        if (email) {
            setEmails([...emails, email]);
            setEmail('');
        }
    };

    return (
        <div>
            <h1>MailListView</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
            />
            <button onClick={handleAddEmail}>Add Email</button>
            <ul>
                {emails.map((email, index) => (
                    <li key={index}>{email}</li>
                ))}
            </ul>
        </div>
    );
}

export default MailListView;