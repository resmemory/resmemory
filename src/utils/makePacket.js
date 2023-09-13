export const makePacket = (uri, method, key, params, mock) => {
  return {
    uri,
    method,
    key,
    params,
    mock,
  };
};
