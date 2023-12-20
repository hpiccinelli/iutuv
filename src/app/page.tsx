'use client';
import { useState, useEffect } from 'react';
import ytdl from 'ytdl-core';

const isValidUrl = (videoUrl: string) => {
  return ytdl.validateURL(videoUrl);
};

const Home = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');

  useEffect(() => {
    
    // Lógica para obtener los formatos disponibles del video desde el servidor
    const fetchFormats = async () => {
      try {
        const response = await fetch(`/api/getFormats?url=${videoUrl}`);
        const data = await response.json();
        setFormats(data.formats);
      } catch (error) {
        console.error('Error al obtener los formatos del video', error);
      }
    };
    
    fetchFormats();
  }, [videoUrl]);

  const handleDownload = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/download?url=${videoUrl}&itag=${selectedFormat}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    const selectedFormatInfo = formats.find((format) => format.itag == selectedFormat);
  
    if (selectedFormatInfo) {
      const fileExtension = selectedFormatInfo.container;
      link.href = url;
      link.setAttribute('download', `video.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } else {
      console.error('No se encontró el formato seleccionado en la lista de formatos');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="text-center">
        <h1 className="text-3xl font-semibold mb-4">Bienvenido a iutuv</h1>
        <form onSubmit={handleDownload} className="mb-8">
          <label htmlFor="inputField" className="block mb-2">Introduce el link de tu video:</label>
          <input
            type="text"
            id="inputField"
            name="inputField"
            className="bg-gray-100 border border-gray-300 rounded py-2 px-4 mb-4 text-black"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <label htmlFor="dropdown" className="block mb-2">Selecciona un formato:</label>
          <select
          
  id="dropdown"
  name="dropdown"
  className="bg-gray-100 border border-gray-300 rounded py-2 px-4 mb-4 text-black "
  value={selectedFormat}
  onChange={(e) => setSelectedFormat(e.target.value)}
>
  <option value="">Selecciona un formato</option>
  {formats &&
    formats.map((format) => (
      <option key={format.itag} value={format.itag}>
        {format.container}  {format.resolution} {format.hasAudio ? "Tiene audio" : "No tiene audio"}
      </option>
    ))}
</select>

          <button type="submit" disabled={!isValidUrl(videoUrl) || !selectedFormat} 
           className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300 ml-4">
            Descargar
          </button>
        </form>
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;