import Joyride from 'react-joyride'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VERBOSE } from '@/CONSTANTS'
import { DEFAULT_JOYRIDE_STYLE } from "@/CONSTANTS_JOYRIDE";

export default function N4LJoyride ({ refJoyrideButton, JOYRIDE_state = {}, KEY = 'DEFAULT' }) {

  const { t } = useTranslation()

  const [joyride, setJoyride] = useState(JOYRIDE_state)
  const joyrideRef = useRef()

  const joyride_locale = {
    back : t('joyride.back'),
    close: t('joyride.close'),
    last : t('joyride.last'),
    next : t('joyride.next'),
    open : t('joyride.open'),
    skip : t('joyride.skip')
  }

  const updateScreenJoyride = useCallback(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  useEffect(() => {
    const eventListener_scroll = () => {
      updateScreenJoyride()
    }
    window.addEventListener('scroll', eventListener_scroll, { passive: true })

    return () => window.removeEventListener('scroll', eventListener_scroll, {})
  }, [updateScreenJoyride])

  useEffect(() => {
    setJoyride(JOYRIDE_state)

    if (localStorage.getItem('linear-regression.joyride-' + KEY) !== null) {
      localStorage.setItem('linear-regression.joyride-' + KEY, JSON.stringify({ run: true }))
    } else {
      console.debug('else linear-regression.joyride-' + KEY)
    }
  }, [JOYRIDE_state])

  useImperativeHandle(refJoyrideButton, () => ({
    handleClick_StartJoyride
  }), [])

  const handleClick_StartJoyride = () => {
    joyrideRef.current?.store.reset()
    joyrideRef.current?.store.start()
  }

  if(VERBOSE) console.debug('render N4LJoyride')
  return <>
    <Joyride ref={joyrideRef}
             style={DEFAULT_JOYRIDE_STYLE}
             locale={joyride_locale}
             callback={joyride.handleJoyrideCallback}
             continuous={joyride.continuous}
             run={joyride.run}
             steps={joyride.steps}
             showProgress={true}
             spotlightClicks={true} />
  </>
}