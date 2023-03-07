import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export async function alertError(texto) {
  MySwal.fire({
    didOpen: () => {
      MySwal.clickConfirm()
    },
  }).then(() => {
    return MySwal.fire({
      icon              : 'error',
      title             : 'Opps...',
      confirmButtonColor: '#0081D5',
      text              : texto,
    })
  })
}

export async function alertInfo(text, title, footer = "") {
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

export async function alertWarning(title, params = { text: "", footer: "", htm: <></> }) {
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

export async function alertSuccess(texto) {
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
      title            : texto,
    })
  })
}
