import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <div className="mt-8 text-center">

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
      />

      <p className="mt-6 text-lg">
        🤖 AI is analyzing your resume...
      </p>

      <p className="text-gray-400 mt-2">
        Extracting skills • Matching JD • Calculating ATS
      </p>

    </div>
  );
}