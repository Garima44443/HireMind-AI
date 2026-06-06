
import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function App() {
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [score, setScore] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resumeWords, setResumeWords] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!file || !jd) {
    alert("Please upload resume and enter JD");
    return;
  }

  const formData = new FormData();
  formData.append("jd", jd);
  formData.append("file", file);

  try {
    setLoading(true);

    const response = await axios.post(
      "https://hiremind-ai-3.onrender.com",
      formData
    );

    setScore(response.data.match_score);
    setSkills(response.data.matched_skills || []);
    setMissingSkills(response.data.missing_skills || []);
    setSuggestions(response.data.suggestions || []);
    setResumeWords(response.data.resume_words || 0);

  } catch (error) {
    console.error(error);
    alert("Error connecting to backend");
  } finally {
    setLoading(false);
  }
};

  const getBadge = () => {
    if (score === null) return "";

    if (score >= 80) return "🚀 Excellent Candidate";
    if (score >= 60) return "✅ Good Candidate";
    if (score >= 40) return "⚡ Average Candidate";

    return "❌ Needs Improvement";
  };

  const downloadReport = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("HireMind AI ATS Report", 20, 20);

    pdf.setFontSize(12);
    pdf.text("By Garima Solakhiya", 20, 30);

    pdf.text(`ATS Score: ${score}%`, 20, 50);
    pdf.text(`Resume Word Count: ${resumeWords}`, 20, 60);

    pdf.text(
      `Matched Skills: ${skills.join(", ")}`,
      20,
      80
    );

    pdf.text(
      `Missing Skills: ${missingSkills.join(", ")}`,
      20,
      100
    );

    pdf.save("HireMind_Report.pdf");
  };
  const chartData = [
  {
    name: "Matched",
    value: skills.length,
  },
  {
    name: "Missing",
    value: missingSkills.length,
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white flex justify-center items-center px-6 py-10">

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

        <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          HireMind AI
        </h1>

        <p className="text-center text-purple-300 text-sm mt-2 italic">
          by Garima Solakhiya
        </p>

        <p className="text-center text-gray-400 mt-4 mb-8">
          AI Powered Resume Screening & ATS Ranking System
        </p>

        <textarea
          placeholder="Paste Job Description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          className="w-full h-40 p-4 rounded-xl bg-black/30 border border-white/20 outline-none mb-6"
        />

        <label className="block border-2 border-dashed border-purple-500 rounded-2xl p-10 text-center cursor-pointer mb-4 hover:bg-purple-500/10 transition">

          <p className="text-xl font-semibold">
            📄 Upload Resume
          </p>

          <p className="text-gray-400 mt-2">
            Click here to upload PDF Resume
          </p>

          <input
  type="file"
  accept=".pdf"
  className="hidden"
  onChange={(e) =>
    setFile(e.target.files?.[0] || null)
  }
/>

        </label>

        {file && (
  <div className="mb-6 bg-green-500/10 border border-green-500 rounded-xl p-3 text-center">
    ✅ Resume Uploaded Successfully
    <br />
    <span className="text-gray-300">
      {file.name}
    </span>
  </div>
)}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold text-lg"
        >
          Analyze Resume
        </button>

        {loading && (
          <div className="mt-10 text-center">

            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-6 text-lg font-semibold">
              🤖 AI is analyzing your resume...
            </p>

            <p className="text-gray-400 mt-2">
              Extracting Skills • Matching JD • Calculating ATS Score
            </p>

          </div>
        )}
       

       {score !== null && (
  <div className="mt-12">

    <div className="flex justify-center mt-8">
      <div className="w-56 h-56">
    <CircularProgressbar
      value={score || 0}
      text={`${score || 0}%`}
      styles={buildStyles({
        textSize: "16px",
        pathColor: "#22c55e",
        textColor: "#22c55e",
        trailColor: "#222",
      })}
    />
  </div>
</div>
            <h2 className="text-center text-2xl font-bold mt-6">
              {getBadge()}
            </h2>

            <p className="text-center text-gray-400 mt-2">
              Resume Word Count: {resumeWords}
            </p>

            <button
              onClick={downloadReport}
              className="mt-6 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
            >
              📄 Download ATS Report
            </button>

            
              <div className="grid md:grid-cols-2 gap-8 mt-10">

  <div className="bg-white/5 border border-green-500/20 rounded-2xl p-6 backdrop-blur-md">
    
    <h2 className="text-2xl font-bold text-green-300 mb-4">
      ✅ Matched Skills
    </h2>

    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 text-green-300 shadow-lg"
        >
          {skill}
        </span>
      ))}
    </div>

  </div>

  <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-md">

    <h2 className="text-2xl font-bold text-pink-300 mb-4">
      ⚠️ Missing Skills
    </h2>

    <div className="flex flex-wrap gap-3">
      {missingSkills.map((skill, index) => (
        <span
          key={index}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/40 text-pink-300 shadow-lg"
        >
          {skill}
        </span>
      ))}
    </div>

  </div>

</div>
<div className="mt-10">

  <h2 className="text-2xl font-bold text-cyan-400 mb-4">
    Skills Analytics
  </h2>

  <div className="bg-white/5 rounded-2xl p-4 h-80">

    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>

  </div>

</div>

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                AI Suggestions
              </h2>

              <div className="space-y-3">

                {suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 p-4 rounded-xl"
                    >
                      👉 {item}
                    </div>
                  ))
                ) : (
                  <div className="bg-green-500/10 p-4 rounded-xl">
                    🎉 Resume already matches most requirements.
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;
