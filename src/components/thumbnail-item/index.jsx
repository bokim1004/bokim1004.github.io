import React from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'

import './index.scss'
import Image from "gatsby-image";

export const ThumbnailItem = ({ node }) => {

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return(
        <Link className={`thumbnail ${TARGET_CLASS}`} to={node.fields.slug}>
             <div className={'thumbnailWrapper'}>
                 {node.frontmatter.image && !isMobile && <img src={node.frontmatter.image} alt={"img"}/>}
            <div key={node.fields.slug} className={'slug'}>
                <h3>{node.frontmatter.title || node.fields.slug}</h3>
                <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
             </div>
        </Link>
    )
}


