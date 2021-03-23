import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'

import Login from '../../pages/Login'

function App() {
    return <BrowserRouter>
        <Switch>
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