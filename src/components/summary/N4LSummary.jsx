import React from 'react'

/**
 * @typedef {Object} N4LSummaryProps
 * @property {React.JSX.Element|string} title
 * @property {React.JSX.Element} [info=<></>]
 * @property {React.ReactNode} [children=<></>]
 */
/** 
 * 
 * @param {N4LSummaryProps} N4LSummaryProps
 * @returns 
 */
export default function N4LSummary ({ title, info=<></>, children=<></> }) {
  return <>
    <details>
      <summary className={'n4l-summary-1-25'}>{title}</summary>
      <main>{info} {children}</main>
    </details>
  </>
}
