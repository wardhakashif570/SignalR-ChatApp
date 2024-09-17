import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        // Setup SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7259/chatHub", {
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true 
            })
            .withAutomaticReconnect() 
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR!');
                    
                    // Listen for incoming messages from the server
                    connection.on('ReceiveMessage', (user, message) => {
                        debugger
                        setMessages(prevMessages => [...prevMessages, { user, message }]);
                    });
                })
                .catch(err => console.log('Error while starting SignalR connection:', err));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection && message && user) {
            try {
                // Send message to the server
                await connection.invoke("SendMessage", user, message);
                setMessage(''); 
            } catch (error) {
                console.log('Error sending message:', error);
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Chat Room</h2>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="Enter a message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
                    Send
                </button>
            </div>
            <div>
                <h3>Messages:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {messages.map((msg, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>{msg.user}</strong>: {msg.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;
