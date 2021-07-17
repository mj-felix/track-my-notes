import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth/auth.context.js';

const PublicRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);
    const { refreshToken } = authContext;

    return (
        <Route
            {...rest}
            render={
                (props) => {
                    const redirect = props.location.search ? props.location.search.split('=')[1] : '/notes';
                    return refreshToken ? (
                        <Redirect to={redirect} />
                    ) : (
                        <Component {...props} />
                    );
                }
            }
        />
    );
};

export default PublicRoute;