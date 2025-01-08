/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AGE_CONSENT } from '@/constants/local-storage'

const AgeConsent: React.FC = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const navigate = useNavigate()

  const onAccept = () => {
    localStorage.setItem(AGE_CONSENT, 'true')
    setIsVisible(false)
  }

  const onDecline = () => {
    localStorage.setItem(AGE_CONSENT, 'false')
    setIsVisible(false)
    navigate(-1)
  }

  useEffect(() => {
    const ageConsent = localStorage.getItem(AGE_CONSENT)

    if (ageConsent === null) {
      localStorage.setItem(AGE_CONSENT, 'false')
      setIsVisible(true)
    } else if (ageConsent === 'false') {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }

    document.body.style.overflow = isVisible ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  if (!isVisible) {
    return <></>
  }

  return (
    <div className="absolute inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-black/80 px-4 sm:px-0">
      <div className="w-full rounded-lg border border-white/20 bg-background p-4 text-white sm:w-[500px]">
        <h1 className="text-center text-xl font-bold">Age Verification</h1>
        <div className="text-md my-4 text-center">
          This website contains explicit adult content that is intended for users over the age of 18 (or the age of
          majority in your jurisdiction). By accessing this site, you confirm that you are of legal age to view such
          content. If you are under the legal age or if adult content is prohibited in your area, you must leave this
          website immediately.
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="rounded bg-primary-700 px-4 py-2 text-white transition hover:bg-primary-800"
            data-cy="accept-age-consent"
          >
            I am over 18
          </button>
          <button
            onClick={onDecline}
            className="rounded bg-secondary-700 px-4 py-2 text-white transition hover:bg-secondary-800"
          >
            I am under 18
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgeConsent
