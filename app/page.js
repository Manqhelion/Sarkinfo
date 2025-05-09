'use client';

import { useState, useRef } from 'react';
import RandomCornerImage from "../components/RandomCornerImage";
import { FaSearch, FaArrowLeft } from 'react-icons/fa';

export default function Home() {
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [songInfo, setSongInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFade, setSearchFade] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSongName(value);
    setArtist('');
    setSongInfo(null);
    setError('');
    if (value.length >= 3) {
      const res = await fetch(`/api/song-suggest?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSongName(suggestion.name);
    setArtist(suggestion.artist);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchFade(false);
    setSearchOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSongInfo(null);
    try {
      const response = await fetch(
        `/api/song-info?name=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist)}`
      );
      if (!response.ok) {
        throw new Error('Şarkı bilgileri alınamadı');
      }
      const data = await response.json();
      setSongInfo(data);
    } catch (err) {
      setError('Şarkı bilgileri alınırken bir hata oluştu');
      setSongInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuMouseLeave = () => {
    setSearchFade(false);
    setTimeout(() => setSearchOpen(false), 300);
  };

  const handleBack = () => {
    setSongInfo(null);
    setSongName('');
    setArtist('');
    setSearchOpen(true);
    setTimeout(() => setSearchFade(true), 10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh] relative">
        <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translate(-50%, 0)', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!songInfo && !searchOpen && !songName && (
            <div className="flex flex-col items-center justify-center mb-8">
              <div
                className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-200/20 hover:bg-gray-300/30 transition-all duration-300 cursor-pointer shadow-lg relative"
                onClick={() => { setSearchOpen(true); setTimeout(() => setSearchFade(true), 10); }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('.emoji').style.opacity = '1';
                  e.currentTarget.querySelector('.searchicon').style.opacity = '0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('.emoji').style.opacity = '0';
                  e.currentTarget.querySelector('.searchicon').style.opacity = '1';
                }}
              >
                <FaSearch className="searchicon text-4xl text-gray-400 transition-all duration-300 absolute" style={{ opacity: 1 }} />
                <span className="emoji text-4xl absolute transition-all duration-300" style={{ opacity: 0 }} role="img" aria-label="dil">😛</span>
              </div>
            </div>
          )}
          {!songInfo && (searchOpen || songName) && (
            <div
              className={`bg-black/80 p-8 rounded-2xl shadow-2xl relative border border-gray-800 w-full max-w-xl mx-auto flex flex-col items-center transition-all duration-300 ${searchFade || songName ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              onMouseLeave={handleMenuMouseLeave}
              onMouseEnter={() => setSearchFade(true)}
              style={{ zIndex: 10 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 font-sans w-full">
                <div className="relative w-full">
                  <label htmlFor="songName" className="block text-gray-200 font-semibold mb-2 tracking-wide">
                    Şarkı Adı
                  </label>
                  <input
                    type="text"
                    id="songName"
                    ref={inputRef}
                    value={songName}
                    onChange={handleInputChange}
                    onFocus={() => songName.length >= 3 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    className="w-full px-4 py-2 bg-black text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 font-medium shadow-md transition"
                    placeholder="Şarkı adını girin..."
                    autoComplete="off"
                    required
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 left-0 right-0 bg-black border border-gray-700 rounded-lg mt-1 max-h-56 overflow-y-auto shadow-lg">
                      {suggestions.map((s, i) => (
                        <li
                          key={s.name + s.artist + i}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-900 text-gray-200 font-semibold transition-colors border-b border-gray-800 last:border-b-0"
                          onMouseDown={() => handleSuggestionClick(s)}
                        >
                          <span className="font-bold text-yellow-300">{s.name}</span> <span className="text-gray-400">- {s.artist}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {songName && (
                  <button
                    type="submit"
                    disabled={loading || !artist}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 font-bold text-lg shadow-md tracking-wide mt-4 animate-fade-in"
                  >
                    {loading ? 'Aranıyor...' : 'Büyük Kırmızı Buton'}
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-700 text-white rounded-md">
            {error}
          </div>
        )}
        {songInfo && (
          <div className="mt-8 p-6 bg-black/90 rounded-lg flex flex-col sm:flex-row items-center gap-6 border border-gray-800 max-w-2xl mx-auto relative">
            <button
              onClick={handleBack}
              className="absolute -top-6 left-0 flex items-center gap-2 bg-black/80 text-gray-200 hover:text-white px-3 py-2 rounded-full shadow transition z-10 border border-gray-700"
              style={{ fontSize: 20 }}
            >
              <FaArrowLeft />
              <span className="text-sm font-semibold">Geri</span>
            </button>
            <div className="flex flex-col items-center w-full">
              {songInfo.cover && songInfo.cover !== '' && (
                <img
                  src={songInfo.cover}
                  alt={songInfo.name + ' cover'}
                  className="w-40 h-40 object-cover rounded shadow-md border mb-4 mt-2"
                  style={{ marginTop: '0.5rem' }}
                />
              )}
              <h2 className="text-2xl font-bold text-gray-100 mb-4">{songInfo.name}</h2>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="font-semibold">Albüm:</span> {songInfo.album}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Süre:</span> {songInfo.duration}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Türler:</span> {songInfo.genres && songInfo.genres.length > 0 ? songInfo.genres.join(', ') : 'Bilinmiyor'}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Dinleyici Sayısı:</span> {songInfo.listeners}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold">Çalma Sayısı:</span> {songInfo.playcount}
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(songInfo.artist + ' ' + songInfo.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg"
                  style={{ marginRight: '0.5rem' }}
                >
                  YouTube'da Dinle
                </a>
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(songInfo.artist + ' ' + songInfo.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition text-lg border-2 border-green-400"
                  style={{ marginLeft: '0.5rem' }}
                >
                  Spotify'da Dinle
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <RandomCornerImage />
    </main>
  );
}
