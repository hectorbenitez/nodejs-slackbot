import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function SurveySession() {
    const params = useParams();
    const [session, setSession] = useState(null);
    useEffect(async () => {
        const response = await axios.get(`/api/v1/surveySessions/${params.id}`);
        setSession(response.data);
    }, []);

    if(!session) {
        return <span>Loading...</span>
    }

    return <div>
        <h1>Session {session._id}</h1>
        <h1>User {session.userName}</h1>
    </div>
}

export default SurveySession