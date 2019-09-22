import {Route, Switch} from "react-router";
import {Home} from "./Home";
import {Hello} from "./Hello";
import * as React from "react";

export function AppRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/hello" component={Hello} />
        </Switch>
    )
}