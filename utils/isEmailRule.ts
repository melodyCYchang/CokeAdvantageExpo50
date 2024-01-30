export const isEmailRule = {
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,

    message: 'error.invalidEmail',
  },
};
