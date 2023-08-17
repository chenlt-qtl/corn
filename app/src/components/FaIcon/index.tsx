import React from 'react';
import 'font-awesome/css/font-awesome.min.css';



const FaIcon: React.FC<{}> = props => {
    const { className } = props
    
    return (
        <span className={`fa ${className}`}></span>
    );
};

export default FaIcon;
