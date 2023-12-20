import ytdl from 'ytdl-core';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const url = searchParams.get('url'); // Obtén la URL del video de la solicitud del cliente
    const itag = searchParams.get('itag'); // Obtén el itag del parámetro
    
    const videoInfo = await ytdl.getInfo(url);

    const videoFormat = videoInfo.formats.find((fmt) => fmt.itag === parseInt(itag));

    if (videoFormat) {
      const { container, qualityLabel } = videoFormat;

      const response = await fetch(videoFormat.url);
      const buffer = await response.arrayBuffer();
      return new Response(buffer, {
        headers: {
          'Content-Type': `video/mp4`,
          'Content-Disposition': `attachment; filename="${videoInfo.title}.${container}"`,
        },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Format not available' }), { status: 400 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
