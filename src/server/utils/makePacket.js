export const makePacket = (uri, method, key, params) => {
  return {
    uri,
    method,
    key,
    params,
  };
};
