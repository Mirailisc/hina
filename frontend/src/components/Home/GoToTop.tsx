import React, { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'

const GoToTop: React.FC = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className={`fixed bottom-5 right-5 flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-colors duration-200 hover:bg-primary-800 ${isVisible ? 'block' : 'hidden'}`}
      onClick={scrollToTop}
    >
      <FaArrowUp size={20} />
    </div>
  )
}

export default GoToTop
