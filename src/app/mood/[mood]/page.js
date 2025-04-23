"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const moodData = {
  happy: {
    bg: "from-yellow-100 to-yellow-300",
    quote: "Happiness is not by chance, but by choice. – Jim Rohn",
    image: "/happy.jpg",
  },
  calm: {
    bg: "from-blue-100 to-blue-300",
    quote: "Peace comes from within. Do not seek it without. – Buddha",
    image: "/calm.jpg",
  },
  sad: {
    bg: "from-gray-200 to-gray-400",
    quote: "Tears come from the heart and not from the brain. – da Vinci",
    image: "/sad.jpg",
  },
  energetic: {
    bg: "from-red-100 to-orange-300",
    quote: "Energy and persistence conquer all things. – Franklin",
    image: "/energetic.jpg",
  },
  nostalgic: {
    bg: "from-pink-100 to-pink-300",
    quote: "Nostalgia is a dirty liar… – Michelle K.",
    image: "/nostalgic.jpg",
  },
};

export default function MoodPage() {
  const { mood } = useParams(); // `useParams()` ile parametreyi alıyoruz.
  const [note, setNote] = useState(""); // Kullanıcı notunu burda tutuyoruz
  const [notes, setNotes] = useState([]); // Birden fazla notu tutacak array

  const data = moodData[mood.toLowerCase()];

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  useEffect(() => {
    fetch(`http://localhost:5001/notes?mood=${mood}`) // URL'de `mood` parametresi kullanarak filtreleme
      .then((response) => response.json())
      .then((data) => setNotes(data));
  }, [mood]); // `mood` değiştiğinde notları yeniden çekiyoruz

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      const newNote = {
        text: note,
        mood: mood, // `mood` parametresi burada
      };

      fetch("http://localhost:5001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      })
        .then((response) => response.json())
        .then((data) => {
          setNotes([...notes, data]); // Yeni notu state'e ekle
          setNote(""); // Textarea'yı temizle
        });
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${data.bg} p-8`}
    >
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 capitalize">
        {mood}
      </h1>
      <p className="text-xl text-gray-700 italic max-w-xl text-center mb-8">
        "{data.quote}"
      </p>

      <div className="w-full max-w-2xl h-[300px] overflow-hidden rounded-2xl shadow-lg mb-8">
        <img
          src={data.image}
          alt={`${mood} image`}
          className="w-full h-full object-cover"
        />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Mood'unuz hakkında bir şeyler yazın..."
          className="text-black w-full h-32 p-4 border border-gray-300 rounded-lg mb-4"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600"
        >
          Notu Kaydet
        </button>
      </form>

      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
        <ul>
          {notes.map((note, index) => (
            <li
              key={index}
              className="text-black bg-gray-100 p-4 mb-2 rounded-lg shadow-md"
            >
              {note.text}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
