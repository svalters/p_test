import React from "react"

const ProgressBar: React.FC<{ total: number; lastQuestionIndex: number }> = ({
  total,
  lastQuestionIndex,
}) => {
  const percentage = total > 0 ? 100 * (lastQuestionIndex / total) : 0

  return (
    <div className='flex w-full items-center'>
      <div className='flex flex-grow overflow-hidden h-2 bg-gray-100 rounded'>
        <div
          style={{ width: `${percentage}%` }}
          className='bg-green-300 transition-all duration-500 ease-in-out'
        />
      </div>
      <p className='font-bold ml-6 !my-0'>{Math.round(percentage)}%</p>
    </div>
  )
}

export default React.memo(ProgressBar)
