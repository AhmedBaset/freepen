import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

function Home({}: Props) {
  return (
    <div className='container'>
      <h1>Home</h1>

      <Link to='/new'>New Blog</Link>
    </div>
  )
}

export default React.memo(Home);