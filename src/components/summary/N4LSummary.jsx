export default function N4LSummary({ title, info }) {
  return <>
    <details>
      <summary>{title}</summary>
      <main>{info}</main>
    </details>
  </>
}