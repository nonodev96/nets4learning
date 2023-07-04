import { Trans, useTranslation } from "react-i18next"
import Joyride from 'react-joyride';
import React, { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap";

export default function LinearRegressionManual({ i_model }) {

  const prefixManual = "pages.playground.1-linear-regression.generator.";
  const { t } = useTranslation()

  const joyrideRef = useRef()
  const [joyride, setJoyride] = useState(i_model.JOYRIDE())
  const joyride_locale = {
    back : t("joyride.back"),
    close: t("joyride.close"),
    last : t("joyride.last"),
    next : t("joyride.next"),
    open : t("joyride.open"),
    skip : t("joyride.skip")
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

  useEffect(() => {
    setJoyride(i_model.JOYRIDE())

    if (localStorage.getItem("linear-regression.joyride-" + i_model._KEY) !== null) {
      localStorage.setItem("linear-regression.joyride-" + i_model._KEY, JSON.stringify({ run: true }))
    } else {
      console.debug("else linear-regression.joyride-" + i_model._KEY)
    }
  }, [i_model])

  useEffect(() => {
    const scroll = () => {
      updateScreenJoyride()
    }
    window.addEventListener("scroll", scroll, { passive: true })

    return () => window.removeEventListener("scroll", scroll, {})
  }, []);

  const updateScreenJoyride = () => {
    window.dispatchEvent(new Event('resize'));
  }


  const joyrideButton = () => {
    return <>
      <Button size={"sm"}
              variant={"outline-primary"}
              onClick={() => {
                console.log(joyrideRef.current)
                joyrideRef.current?.store.reset()
                joyrideRef.current?.store.start()
              }}>Joyride Button</Button>
    </>
  }


  console.log("render LinearRegressionManual")
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

    {joyrideButton()}
    <br />

    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} /><br />
    <Trans i18nKey={prefixManual + "TEXT_1"} />
  </>
}