const validateApiResponse = (data: any) => {
  if (data?.error?.data?.message) {
    throw new Error(data.error.data.message);
  }
  if (data?.error?.error) {
    throw new Error(data.error.error);
  }
  if (data?.error?.message) {
    throw new Error(data.error.message);
  }
};

export default validateApiResponse;
