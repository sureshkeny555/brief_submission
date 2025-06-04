import axios from 'axios';
import config from '../config/index';

const { apiBaseUrl } = config || {};

const client = async (
  url,
  {
    body,
    method,
    contentType = 'application/json',
    accessToken = localStorage.getItem('token'),
    includeAuthorization = true,
    isFileUpload = false,
    ...customConfig
  } = {}
) => {
  let headers = {
    ...(includeAuthorization && accessToken && { Authorization: `Bearer ${accessToken}` }), 
  };

  // if (!isFileUpload) {
  //   headers['Content-Type'] = contentType;
  // }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  const requestConfig = {
    url,
    method,
    baseURL: apiBaseUrl,
    headers,
    data: method === 'GET' ? null : body,
  };

  let data;

  try {
    const response = await axios(requestConfig);
    data = await response.data;

    const { status, ...restData } = data || {};
    if (response.status === 200) {
      if (data?.message === 'success' || data?.status === 'success') {
        return {
          status: true,
          data: restData,
        };
      }
    }
    return {
      status: false,
      data: restData,
      message: data?.status,
    };
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Return 401 error without retrying or refreshing token
      return {
        status: false,
        data: err?.response?.data || err.data || null,
        message: 'Session expired or unauthorized access. Please log in again.',
      };
    }

    return {
      status: false,
      data: err?.response?.data || err.data || null,
      message: err?.message,
      error: err,
    };
  }
};

client.get = function (url, customConfig = {}) {
  return client(url, { ...customConfig, method: 'GET' });
};

client.post = function (url, body, customConfig = {}) {
  return client(url, { ...customConfig, method: 'POST', body });
};

client.put = function (url, body, customConfig = {}) {
  return client(url, { ...customConfig, method: 'PUT', body });
};

client.delete = function (url, body, customConfig = {}) {
  return client(url, { ...customConfig, method: 'DELETE', body });
};

client.uploadFile = function (url, formData, customConfig = {}) {
  return client(url, {
    ...customConfig,
    method: 'POST',
    body: formData,
    isFileUpload: true,
    contentType: 'multipart/form-data',
  });
};

export { client };
