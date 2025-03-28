/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'

const Card = ({title,description}) => {
    return (
        <div className="bg-[#FFFFFF] p-4  border-2 border-blue-500 rounded-lg shadow-md max-w-3xs">
            <h3 className="text-lg font-semibold text-[#000000]">{title}</h3>
            <p className="text-[#000000] text-sm mt-2">{description}</p>
        </div>
    )
}

export default Card;