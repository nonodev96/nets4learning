import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

async function alertError (text, params = { title: 'Error' }) {
  MySwal.fire({
    didOpen: () => {
      MySwal.clickConfirm()
    },
  }).then(() => {
    return MySwal.fire({
      icon              : 'error',
      title             : params.title,
      confirmButtonColor: '#0081D5',
      text              : text,
    })
  })
}

async function alertInfo (text, title, footer = '') {
  return MySwal.fire({
    didOpen: () => {
      MySwal.clickConfirm()
    },
  }).then(() => {
    return MySwal.fire({
      icon              : 'question',
      title             : title,
      text              : text,
      footer            : footer,
      confirmButtonColor: '#0081D5',
    })
  })
}

async function alertWarning (title, params = { text: '', footer: '', html: <></> }) {
  return MySwal.fire({
    didOpen: () => {
      MySwal.clickConfirm()
    },
  }).then(() => {
    return MySwal.fire({
      icon              : 'warning',
      title             : title,
      text              : params.text,
      html              : params.html,
      footer            : params.footer,
      confirmButtonColor: '#0081D5',
    })
  })
}

async function alertSuccess (title, params = { text: '', html: <></> }) {
  return MySwal.fire({
    didOpen: () => {
      MySwal.clickConfirm()
    },
  }).then(() => {
    return MySwal.fire({
      // position: 'top-end',
      icon             : 'success',
      showConfirmButton: false,
      timer            : 1500,
      title            : title,
      text             : params.text,
      html             : params.html,
    })
  })
}

const alertHelper = {
  alertError,
  alertWarning,
  alertSuccess,
  alertInfo,
}
export default alertHelper