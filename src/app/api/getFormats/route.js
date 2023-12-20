import ytdl from 'ytdl-core';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const url = searchParams.get('url');

  try {
    if (!url) {
      return new Response(JSON.stringify({ error: 'Invalid format' }), { status: 400 });
    }

    const videoInfo = await ytdl.getInfo(url);
    const formats = videoInfo.formats.map((format) => ({
      itag: format.itag,
      container: format.container,
      resolution: format.height ? `${format.height}p` : 'Audio only',
      hasAudio: format.hasAudio,
    }));

    return new Response(JSON.stringify({ formats }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching video formats: ', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}