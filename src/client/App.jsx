import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {AppRoutes} from "./AppRoutes";

const App = () => {
    return (
        <Router>
            <AppRoutes/>
        </Router>
    )
};

export default App;
