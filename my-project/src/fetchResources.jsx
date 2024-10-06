import axios from 'axios';

export async function fetchResources(topic) {
  if (!topic) {
    console.error('No topic provided to fetchResources');
    return [];
  }

  try {
    const response = await axios.get('/api/resources', {
      params: { topic }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    return [];
  }
}
