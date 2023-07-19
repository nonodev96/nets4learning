import Joyride from 'react-joyride'
import React, { useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LinearRegressionContext from '@context/LinearRegressionContext'
import { VERBOSE } from '@/CONSTANTS'

export default function LinearRegressionJoyride ({ refJoyrideButton }) {

  const { i_model } = useContext(LinearRegressionContext)

  const { t } = useTranslation()

  const joyrideRef = useRef()
  const [joyride, setJoyride] = useState(i_model.JOYRIDE())

  const joyride_locale = {
    back : t('joyride.back'),
    close: t('joyride.close'),
    last : t('joyride.last'),
    next : t('joyride.next'),
    open : t('joyride.open'),
    skip : t('joyride.skip')
  }
  const joyride_style = {
    options: {
      arrowColor     : '#e3ffeb',
      backgroundColor: '#e3ffeb',
      overlayColor   : 'rgba(79, 26, 0, 0.4)',
      primaryColor   : '#000',
      textColor      : '#004a14',
      width          : 900,
      zIndex         : 1000,
    }
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
    setJoyride(i_model.JOYRIDE())

    if (localStorage.getItem('linear-regression.joyride-' + i_model._KEY) !== null) {
      localStorage.setItem('linear-regression.joyride-' + i_model._KEY, JSON.stringify({ run: true }))
    } else {
      console.debug('else linear-regression.joyride-' + i_model._KEY)
    }
  }, [i_model])

  useImperativeHandle(refJoyrideButton, () => ({
    handleClick_StartJoyride
  }), [])

  const handleClick_StartJoyride = () => {
    joyrideRef.current?.store.reset()
    joyrideRef.current?.store.start()
  }

  if(VERBOSE) console.debug('render LinearRegressionJoyride')
  return <>
    <Joyride ref={joyrideRef}
             style={joyride_style}
             locale={joyride_locale}
             callback={joyride.handleJoyrideCallback}
             continuous={joyride.continuous}
             run={joyride.run}
             steps={joyride.steps}
             showProgress={true}
             spotlightClicks={true} />
  </>
}