import React from 'react'
import Media from 'react-media'


const HocMedia = Com => props => {
    return (
        <Media query="(max-width:900px)">
            {
                isMobile => <div className="is-mobile">
                    <Com {...props} isMobile={isMobile} />
                </div>
            }
        </Media>
    )
}

export default HocMedia;
