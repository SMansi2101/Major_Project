import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_BASE_URL;

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [message, setMessage] = useState("");
    const [showRedDots, setShowRedDots] = useState(false);
    const [percentage, setPercentage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/users/quiz/${id}`,{
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuiz(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleSelectAnswer = (questionIndex, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex,
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length !== quiz.questions.length) {
            setShowRedDots(true);
            alert("Please answer all questions before submitting!");
            return;
        }

        let correctAnswers = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                correctAnswers++;
            }
        });

        const calculatedPercentage = ((correctAnswers / quiz.questions.length) * 100).toFixed(2);
        setPercentage(calculatedPercentage);
        setScore(correctAnswers);
        setSubmitted(true);
        setShowPopup(true);

        setMessage(
            calculatedPercentage >= 75
                ? `Great job! You're ready to dive into ${quiz.course.name}! 🎉`
                : "Keep practicing! Strengthen your basics and try again! 💪"
        );

        setTimeout(() => {
            setShowPopup(false);
        }, 10000);
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <motion.div
            className="min-h-screen bg-gray-100 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-3xl font-bold text-center text-purple-700 mb-6"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {quiz.course.name} Quiz
            </motion.h1>

            {showPopup && (
                <motion.div
                    className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg text-center w-96 z-50"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xl font-semibold text-purple-700">{message}</p>
                    <p className="text-lg font-bold mt-2">📊 Your Score: {score} / {quiz.questions.length} ({percentage}%)</p>
                </motion.div>
            )}

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {quiz.questions.map((q, index) => (
                    <motion.div
                        key={index}
                        className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        {showRedDots && answers[index] === undefined && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            {index + 1}. {q.text}
                        </p>
                        <ul className="space-y-2">
                            {q.options.map((opt, i) => (
                                <motion.li
                                    key={i}
                                    className={`p-3 rounded-lg shadow-sm border cursor-pointer transition text-gray-800 ${
                                        answers[index] === i ? "bg-purple-300" : "hover:bg-gray-200"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => handleSelectAnswer(index, i)}
                                >
                                    {opt}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {!submitted ? (
                <motion.button
                    onClick={handleSubmit}
                    className="block mx-auto mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    Submit Quiz
                </motion.button>
            ) : null}
        </motion.div>
    );
};

export default QuizPage;