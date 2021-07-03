import React from "react"
import { CSSTransition } from "react-transition-group"

/**
 * Expected usage as placeholder before fetching data for page
 * - fade out loader and fade in content without it 'jumping in'
 */
const Loading: React.FC<{ isLoading?: boolean; showLoader?: boolean }> = ({
  isLoading = false,
  showLoader = true,
  children,
}) => {
  return (
    <>
      {isLoading && showLoader && (
        <div className='absolute inset-0 w-full h-full flex flex-auto justify-center items-center'>
          <div className='h-5 w-5 bg-gray-400 rounded-full mr-3 animate-bounce' />
          <div className='h-5 w-5 bg-gray-400 rounded-full mr-3 animate-bounce200' />
          <div className='h-5 w-5 bg-gray-400 rounded-full animate-bounce400' />
        </div>
      )}
      <CSSTransition
        in={!isLoading}
        appear={!isLoading}
        timeout={{ enter: 300, exit: 0 }}
        classNames='slide'
        unmountOnExit
        mountOnEnter
      >
        <>{children}</>
      </CSSTransition>
    </>
  )
}

export default Loading
