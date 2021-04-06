import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

import Login from '../../pages/Login'
import SurveySession from '../../pages/SurveySession'
import Surveys from '../../pages/Surveys'

function App() {
    return <BrowserRouter>
        <Switch>
            <Route path='/surveySessions/:id'>
                <SurveySession></SurveySession>
            </Route>
            <Route path='/surveys'>
                <Surveys></Surveys>
            </Route>
            <Route path='/dashboard'>
                <Dashboard></Dashboard>
            </Route>
            <Route path='/'>
                <Login></Login>
            </Route>
        </Switch>
    </BrowserRouter>
}

export default App