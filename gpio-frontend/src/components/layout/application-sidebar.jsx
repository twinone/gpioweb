import React, { useState, useEffect  } from 'react';

import classes from './application-sidebar.module.scss';

const ApplicationSidebar = props => {
    const [visible, setVisible] = useState(props.visible);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(props.visible)
        }, 100);

        return () => clearTimeout(timeout);
    })

    const childrenVisible = props.visible ? visible : props.visible;

    return(<div className={`${props.visible ? '': classes.hidden} ${props.className}`}>{childrenVisible && props.children}</div>)
}

export default ApplicationSidebar;