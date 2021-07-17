import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

const FadeableAlert = ({ variant, msg, cb }) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        setShowAlert(true);
        const fadeOutAlertTimeout = setTimeout(() => {
            setShowAlert(false);
        }, 3000);
        let cbTimeout;
        if (cb) {
            cbTimeout = setTimeout(() => {
                cb();
            }, 3400);
        }
        return () => {
            clearTimeout(fadeOutAlertTimeout);
            if (cbTimeout) {
                clearTimeout(cbTimeout);
            }
        };
    }, [cb]);

    return (
        <CSSTransition
            timeout={400}
            classNames='alert'
            in={showAlert}
            unmountOnExit
        >
            <Alert variant={variant}
                onClose={
                    () => {
                        setShowAlert(false);
                        if (cb) cb();
                    }
                }
                dismissible>
                {msg}
            </Alert>
        </CSSTransition >
    );
};

FadeableAlert.defaultProps = {
    variant: 'info',
};

FadeableAlert.propTypes = {
    variant: PropTypes.string,
    msg: PropTypes.string.isRequired,
    cb: PropTypes.func,
};

export default FadeableAlert;