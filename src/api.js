export const baseURL = process.env.REACT_APP_BASE_URL;
console.log("URL: ", baseURL)

export const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.log('Error de servidor');
      throw new Error('Error de servidor');
    }
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
};
