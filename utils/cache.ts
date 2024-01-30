const cache: any = {};

const set = (key: string, value: any, ttl?: number) => {
  const expiresAt = ttl && ttl > 0 ? Date.now() + ttl : 0;
  cache[key] = {
    value,
    expiresAt,
  };
};

const get = (key: string) => {
  const now = Date.now();
  //   if (cache[key]) {
  // if (cache[key].expiresAt === 0) {
  //   return cache[key].value
  //   } else if (now < cache[key].expiresAt) {

  //   }
  //   return null;
  return (
    cache[key] &&
    (cache[key].expiresAt === 0 || now < cache[key].expiresAt) &&
    cache[key].value
  );
};

const del = (key: string) => {
  delete cache[key];
};

export default {
  set,
  get,
  del,
};
