import { Trans, useTranslation } from "react-i18next"
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
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
      console.debug("èlse linear-regression.joyride-" + i_model._KEY)
    }
  }, [i_model])

  useEffect(() => {
    const interval = setInterval(() => {
      updateScreenJoyride()
    }, 5000);

    return () => clearInterval(interval);
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


  const handleJoyrideCallback = (data) => {
    console.log("handleJoyrideCallback", { data })
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED]).includes(status)) {
      setJoyride({ ...joyride, run: false, stepIndex: 0 });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1)
      console.log({ nextStepIndex })

      if (index === 0) {

      } else if (index === 1) {

      } else if (action === ACTIONS.PREV) {

      } else {

      }
    }
  }

  return <>

    <Joyride ref={joyrideRef}
             style={joyride_style}
             locale={joyride_locale}
             callback={handleJoyrideCallback}
             continuous={joyride.continuous}
             run={joyride.run}
             steps={joyride.steps}
             showProgress={true} />

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