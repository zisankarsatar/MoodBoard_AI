'use client';
import { useRouter } from 'next/navigation';

const moods = [
  { name: 'Happy', color: 'from-yellow-200 to-yellow-400' },
  { name: 'Calm', color: 'from-blue-200 to-blue-400' },
  { name: 'Sad', color: 'from-gray-300 to-gray-500' },
  { name: 'Energetic', color: 'from-red-200 to-red-400' },
  { name: 'Nostalgic', color: 'from-pink-100 to-pink-300' },
];

export default function Home() {
  const router = useRouter();

  const handleClick = (mood) => {
    router.push(`/mood/${mood.toLowerCase()}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">MoodBoard AI 🎨</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {moods.map((mood) => (
          <div
            key={mood.name}
            onClick={() => handleClick(mood.name)}
            className={`cursor-pointer rounded-2xl shadow-md p-8 bg-gradient-to-br ${mood.color} transition transform hover:scale-105`}
          >
            <h2 className="text-xl font-semibold text-gray-900 text-center">{mood.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}
