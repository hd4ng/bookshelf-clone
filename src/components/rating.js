import React from 'react'
import {FaStar} from 'react-icons/fa'

function Rating() {
  return (
    <div className="rating">
      <FaStar className="orange" />
      <FaStar className="orange" />
      <FaStar className="orange" />
      <FaStar className="orange" />
      <FaStar />
    </div>
  )
}

export default Rating
