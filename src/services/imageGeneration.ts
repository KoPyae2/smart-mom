export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://image-generate.www-kokopyaepyae2.workers.dev/generateimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const imageData = await response.blob();
    const imageUrl = URL.createObjectURL(imageData);
    console.log('Generated Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}; 