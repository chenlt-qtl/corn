import React from 'react'
import Media from 'react-media'


const HocMedia = Com => props => {
    return (
        <Media query="(max-width:992px)">
            {
                isMobile => <Com {...props} isMobile={isMobile} />
            }
        </Media>
    )
}

export default HocMedia;
