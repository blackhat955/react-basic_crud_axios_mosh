import axios from "axios";
import { toast }from 'react-toastify';
import logger from './logService';
// toast is function and you call the seprate error by toast.error() in place of simple alert 
// or just use the toast in palce of alert 
// use sentry.io for logging the error for this install raven-js package 

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // Unexpected errors (network down, server down, db down, bug)
  // - Log them
  // - Display generic and friendly error message to user

  if (!expectedError) {
    toast("An unexpected error occurred");
    logger.log(error);
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete

}