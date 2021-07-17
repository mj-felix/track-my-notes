import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';

import AuthContext from '../../context/auth/auth.context.js';
import TooltipPopup from './tooltip-popup.component.jsx';

const RefreshTokenStatus = () => {
    const authContext = useContext(AuthContext);
    const { refreshToken } = authContext;

    const statuses = [
        {
            icon: faBatteryFull,
            color: '#02b875',
            timeLeft: 'more than 4 hours'
        },
        {
            icon: faBatteryThreeQuarters,
            color: '#02b875',
            timeLeft: 'less than 4h'
        },
        {
            icon: faBatteryHalf,
            color: '#02b875',
            timeLeft: 'less than 2h'
        },
        {
            icon: faBatteryQuarter,
            color: '#ec971f',
            timeLeft: 'less than 1h'
        },
        {
            icon: faBatteryEmpty,
            color: '#cc3e3b',
            timeLeft: 'less than 30min'
        },
    ];
    const [status, setStatus] = useState(statuses[0]);

    const refreshStatus = () => {
        const decoded = jwt_decode(refreshToken);
        const now = new Date().getTime() / 1000;
        const time4hInSeconds = 7200;
        const time2hInSeconds = 3600;
        const time1hInSeconds = 1800;
        const time30minInSeconds = 900;
        if (decoded.exp - now < time30minInSeconds) {
            if (status === status[4]) console.log('eq');
            setStatus(statuses[4]);
        } else if (decoded.exp - now < time1hInSeconds) {
            setStatus(statuses[3]);
        } else if (decoded.exp - now < time2hInSeconds) {
            setStatus(statuses[2]);
        } else if (decoded.exp - now < time4hInSeconds) {
            setStatus(statuses[1]);
        } else {
            setStatus(statuses[0]);
        }
    };


    useEffect(() => {
        if (refreshToken) {
            refreshStatus();
            const time5minutes = 5 * 60 * 1000;
            const refreshStatusInterval = setInterval(() => refreshStatus(), time5minutes);
            return () => clearInterval(refreshStatusInterval);
        }
        // eslint-disable-next-line
    }, [refreshToken]);

    return (
        refreshToken ?
            <TooltipPopup
                placement='right'
                msg={`Your session expires in ${status.timeLeft}.`}
            >
                <FontAwesomeIcon icon={status.icon} color={status.color} rotation={270} />
            </TooltipPopup>
            :
            <></>
    );
};

export default RefreshTokenStatus;