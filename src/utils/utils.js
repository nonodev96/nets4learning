export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function isMobile() {
  return navigator?.userAgentData?.mobile || isAndroid() || isiOS();
}

export function isProduction() {
  return process.env.REACT_APP_ENVIRONMENT === "production"
}