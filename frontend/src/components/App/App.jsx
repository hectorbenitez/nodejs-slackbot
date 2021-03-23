import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

import Login from '../../pages/Login'
import SurveySession from '../../pages/SurveySession'

function App() {
    return <BrowserRouter>
        <Switch>
            <Route path='/dashboard'>
                <Dashboard></Dashboard>
            </Route>
            <Route path='/surveySessions/:id'>
                <SurveySession></SurveySession>
            </Route>
            <Route path='/'>
                <Login></Login>
            </Route>
        </Switch>
    </BrowserRouter>
}

export default App