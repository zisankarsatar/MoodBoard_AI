"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const moods = [
  { name: "Happy", color: "from-yellow-200 to-yellow-400" },
  { name: "Calm", color: "from-blue-200 to-blue-400" },
  { name: "Sad", color: "from-gray-300 to-gray-500" },
  { name: "Energetic", color: "from-red-200 to-red-400" },
  { name: "Nostalgic", color: "from-pink-100 to-pink-300" },
];

function isToday(dateStr) {
  const today = new Date();
  const noteDate = new Date(dateStr);
  return (
    noteDate.getDate() === today.getDate() &&
    noteDate.getMonth() === today.getMonth() &&
    noteDate.getFullYear() === today.getFullYear()
  );
}

export default function Home() {
  const router = useRouter();
  const [todayNotes, setTodayNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/notes")
      .then((res) => res.json())
      .then((data) => {
        const todays = data.filter((note) => isToday(note.date));
        console.log(todays)
        setTodayNotes(todays);
      });
  }, []);

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
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              {mood.name}
            </h2>
          </div>
        ))}
      </div>
      {todayNotes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Bugün Eklenen Notlar 🎉
          </h2>
          <div className="space-y-2">
            {todayNotes.map((note) => (
              <div key={note.id} className="p-3 rounded bg-gray-100 shadow-sm">
                <p className="text-sm">{note.text}</p>
                <p className="text-xs text-gray-500 mt-1">Mood: {note.mood}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
