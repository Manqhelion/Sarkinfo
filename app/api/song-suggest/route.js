import { NextResponse } from 'next/server';

const suggestions = [
  { name: 'Shape of You', artist: 'Ed Sheeran' },
  { name: 'Blinding Lights', artist: 'The Weeknd' },
  { name: 'Dance Monkey', artist: 'Tones and I' },
  { name: 'Seninle Bir Dakika', artist: 'Semiha Yankı' },
  { name: 'Fikrimin İnce Gülü', artist: 'Müzeyyen Senar' },
  { name: 'Hadi Gel Gezelim', artist: 'Barış Manço' },
  // ... diğer öneriler ...
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const filtered = suggestions.filter(
    s => s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
  return NextResponse.json({ suggestions: filtered.slice(0, 10) });
} 