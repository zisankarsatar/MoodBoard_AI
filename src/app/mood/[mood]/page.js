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

const getMoodEmoji = (mood) => {
  switch (mood) {
    case "happy":
      return "😀";
    case "sad":
      return "😢";
    case "calm":
      return "😌";
    case "energetic":
      return "🏃‍♀️";
    case "nostalgic":
      return "📞";
    default:
      return "😶";
  }
};

function getMoodColor(mood) {
  switch (mood) {
    case "happy":
      return "bg-yellow-100";
    case "sad":
      return "bg-blue-100";
    case "calm":
      return "bg-green-100";
    case "energetic":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
}

export default function MoodPage() {
  const { mood } = useParams(); // `useParams()` ile parametreyi alıyoruz.
  const [note, setNote] = useState(""); // Kullanıcı notunu burda tutuyoruz
  const [notes, setNotes] = useState([]); // Birden fazla notu tutacak array
  const [filter, setFilter] = useState("");

  const data = moodData[mood.toLowerCase()];

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-CA");

  const newNote = {
    mood,
    text: note,
    date: formattedDate, // <<< BURADA TARİHİ EKLİYORUZ
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/notes/${id}`, {
      method: "DELETE",
    });

    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  useEffect(() => {
    fetch(`http://localhost:5001/notes?mood=${mood}`) // URL'de `mood` parametresi kullanarak filtreleme
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotes(sortedData);
      });
  }, [mood]); // `mood` değiştiğinde notları yeniden çekiyoruz

  const displayedNotes = filter
    ? notes.filter((note) =>
        note.text.toLowerCase().includes(filter.toLowerCase())
      )
    : notes;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      fetch("http://localhost:5001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      })
        .then((response) => response.json())
        .then((data) => {
          const sortedNotes = [...notes, data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setNotes(sortedNotes); // Yeni notu state'e ekle
          setNote(""); // Textarea'yı temizle
        });
    }
  };

  function formatDate(dateString) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  }

  function highlightMatch(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

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
        <h1 className="text-5xl mb-4 flex items-center gap-2">
          <span className="text-6xl animate-bounce">{getMoodEmoji(mood)}</span>
          {mood.toUpperCase()} MOOD
        </h1>
        <input
          type="text"
          placeholder="Notlarda ara..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-6 px-3 py-2 border rounded w-full focus:outline-none focus:ring"
        />
        <ul>
          {displayedNotes.map((note, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 rounded-2xl bg-yellow-50 shadow-md space-x-4 mb-4 border border-yellow-200"
            >
              <div>
                <p className="text-base text-gray-800">
                  {highlightMatch(note.text, filter)}
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  Mood: {note.mood}
                </p>
                <p className="text-sm text-gray-400">{formatDate(note.date)}</p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            </div>
          ))}
        </ul>
      </div>
    </main>
  );
}
