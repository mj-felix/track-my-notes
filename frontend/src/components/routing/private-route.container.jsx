import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth/auth.context.js';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);
    const { refreshToken, noRedirect } = authContext;

    return (
        <Route
            {...rest}
            render={
                (props) => {
                    if (!refreshToken && noRedirect) {
                        return <Redirect to='/login' />;
                    } else if (!refreshToken) {
                        const originalPath = props.location.pathname;
                        return <Redirect to={originalPath ? `/login?redirect=${originalPath}` : '/login'} />;
                    } else {
                        return <Component {...props} />;
                    }
                }
            }
        />
    );
};

export default PrivateRoute;