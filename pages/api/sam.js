import { useState, useEffect } from 'react'

export default function Home() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/api/hello')
            .then(response => response.json())
            .then(data => setMessage(data.message))
    }, [])

    return (
        <div>
            <h1>Message from Flask: {message}</h1>
        </div>
    )
}