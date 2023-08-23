export const makePacket = (uri, method, key, params, data) => {
  return {
    uri,
    method,
    key,
    params,
    data,
  };
};
