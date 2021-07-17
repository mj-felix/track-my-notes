import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TooltipPopup = ({ placement, msg, children }) => {
    return (
        <OverlayTrigger
            key={placement}
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${placement}`}>
                    {msg}
                </Tooltip>
            }
        >
            {children}
        </OverlayTrigger>
    );
};

TooltipPopup.propTypes = {
    placement: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default TooltipPopup;