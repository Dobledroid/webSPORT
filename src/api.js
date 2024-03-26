export const baseURL = 'http://localhost:4000/api';
// export const baseURL = 'https://api-rest-sport.vercel.app/api';

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
