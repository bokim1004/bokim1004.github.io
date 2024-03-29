import React from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'

import './index.scss'

export const ThumbnailItem = ({ node }) => {
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (
    <Link className={`thumbnail ${TARGET_CLASS}`} to={node.fields.slug}>
      <div className={'thumbnailWrapper'}>
        {node.frontmatter.image && (
          <img src={node.frontmatter.image} alt={'img'} />
        )}
        <div key={node.fields.slug} className={'slug'}>
          <p className={'title'}>{node.frontmatter.title || node.fields.slug}</p>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </div>
      </div>
    </Link>
  )
}
