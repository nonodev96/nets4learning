import { useTranslation } from 'react-i18next'

export default function WaitingPlaceholder ({ title = '' }) {

  const { t } = useTranslation()
  return <>
    <p className="placeholder-glow">
      <small className={'text-muted'}>{title ?? t('Waiting')}</small>
      <span className="placeholder col-12"></span>
    </p>
  </>
}