import { NextResponse } from 'next/server';

const fakeDB = [
  {
    name: 'Shape of You',
    artist: 'Ed Sheeran',
    genres: ['Pop'],
    duration: '3:53',
    album: 'Divide',
    listeners: '2,000,000',
    playcount: '5,000,000',
    cover: 'https://i.imgur.com/fBhg0Lv.jpeg',
  },
  {
    name: 'Seninle Bir Dakika',
    artist: 'Semiha Yankı',
    genres: ['Türkçe Pop'],
    duration: '3:00',
    album: 'Single',
    listeners: '500,000',
    playcount: '1,000,000',
    cover: 'https://i.imgur.com/oyUdBpy.png',
  },
  // ... diğer şarkılar ...
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.toLowerCase() || '';
  const artist = searchParams.get('artist')?.toLowerCase() || '';
  const song = fakeDB.find(
    s => s.name.toLowerCase() === name && s.artist.toLowerCase() === artist
  );
  if (!song) {
    return NextResponse.json({}, { status: 404 });
  }
  return NextResponse.json(song);
} 