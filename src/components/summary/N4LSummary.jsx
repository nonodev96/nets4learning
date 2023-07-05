export default function N4LSummary ({ title, info }) {
  return <>
    <details>
      <summary className={'n4l-summary-1-25'}>{title}</summary>
      <main>{info}</main>
    </details>
  </>
}