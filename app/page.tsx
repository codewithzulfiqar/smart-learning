'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

type Screen = 'start' | 'subject' | 'quiz' | 'result';
type Subject = 'math' | 'english' | 'science';

interface Student {
  name: string;
  grade: string;
}

interface Question {
  q: string;
  options: string[];
  answer: string;
}

const quizData: Record<Subject, Question[]> = {
  math: [
    { q: "2 + 2 = ?", options: ["3", "4", "5"], answer: "4" },
    { q: "5 + 3 = ?", options: ["6", "8", "9"], answer: "8" },
    { q: "10 - 4 = ?", options: ["5", "6", "7"], answer: "6" },
    { q: "3 x 3 = ?", options: ["6", "9", "12"], answer: "9" }
  ],
  english: [
    { q: "Apple is a?", options: ["Fruit", "Animal", "Car"], answer: "Fruit" },
    { q: "Choose the correct spelling:", options: ["Bannana", "Banana", "Bananna"], answer: "Banana" },
    { q: "Opposite of 'Hot' is?", options: ["Warm", "Cold", "Sun"], answer: "Cold" },
    { q: "A person who teaches is a...", options: ["Doctor", "Teacher", "Driver"], answer: "Teacher" }
  ],
  science: [
    { q: "Sun is a?", options: ["Planet", "Star", "Moon"], answer: "Star" },
    { q: "Water boils at?", options: ["50°C", "100°C", "150°C"], answer: "100°C" },
    { q: "Which animal says 'Meow'?", options: ["Dog", "Cat", "Cow"], answer: "Cat" },
    { q: "What do plants need to grow?", options: ["Milk", "Soda", "Sunlight"], answer: "Sunlight" }
  ]
};

export default function SmartLearningSystem() {
  const [screen, setScreen] = useState<Screen>('start');
  const [student, setStudent] = useState<Student>({ name: '', grade: '' });
  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.name || !student.grade) {
      alert("Please fill all fields");
      return;
    }
    setScreen('subject');
  };

  const handleStartQuiz = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setScreen('quiz');
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    
    if (option === quizData[selectedSubject][currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData[selectedSubject].length - 1) {
       setCurrentQuestion(prev => prev + 1);
       setSelectedAnswer(null);
    } else {
       setScreen('result');
    }
  };

  const handleRestart = () => {
    setStudent({ name: '', grade: '' });
    setScreen('start');
  };

  const getStepState = (stepScreen: Screen) => {
    const order = { start: 0, subject: 1, quiz: 2, result: 3 };
    const currentOrder = order[screen];
    const thisOrder = order[stepScreen];
    
    if (thisOrder < currentOrder) return 'done';
    if (thisOrder === currentOrder) return 'active';
    return 'upcoming';
  };

  const renderStep = (label: string, stepScreen: Screen) => {
    const state = getStepState(stepScreen);
    let dotClass = "w-3 h-3 rounded-full border-2 mr-3 ";
    let textClass = "";
    
    if (state === 'done') {
      dotClass += "bg-emerald-400 border-emerald-400";
      textClass = "text-indigo-100 font-medium";
    } else if (state === 'active') {
      dotClass += "bg-white border-white";
      textClass = "text-white font-bold";
    } else {
      dotClass += "border-white/40";
      textClass = "text-indigo-300 opacity-60 font-medium";
    }

    return (
      <div className="flex items-center">
        <div className={dotClass}></div>
        <span className={textClass}>{label}</span>
      </div>
    );
  };

  const renderStartScreen = () => (
    <motion.div
      key="start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 flex flex-col w-full h-full"
    >
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Student Profile</h2>
        <p className="text-gray-500 text-lg">Please enter your details to begin learning.</p>
      </header>
      
      <form onSubmit={handleStart} className="space-y-6 max-w-sm flex-1">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Student Name</label>
          <input
            type="text"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            placeholder="e.g. Arjun Mehta"
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-800 font-bold bg-gray-50 focus:bg-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Grade</label>
          <select
            value={student.grade}
            onChange={(e) => setStudent({ ...student, grade: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 font-bold appearance-none cursor-pointer"
            required
          >
            <option value="" disabled>Choose your grade</option>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <option key={num} value={num}>Grade {num}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 group cursor-pointer mt-8"
        >
          Continue
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );

  const renderSubjectScreen = () => (
    <motion.div
      key="subject"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex-1 flex flex-col w-full h-full"
    >
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Choose a Subject</h2>
        <p className="text-gray-500 text-lg">Select the module you wish to start today. Each test takes 10 minutes.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 overflow-y-auto">
        <div onClick={() => handleStartQuiz('math')} className="p-6 rounded-3xl bg-blue-50 cursor-pointer hover:-translate-y-1 transition-transform border-2 border-transparent hover:border-indigo-600">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold">Σ</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mathematics</h3>
          <p className="text-gray-600 text-sm mb-6">{quizData.math.length} Questions covering basic arithmetic logic.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">Level {student.grade}</span>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-600 transition-colors">Start Test</button>
          </div>
        </div>

        <div onClick={() => handleStartQuiz('science')} className="p-6 rounded-3xl bg-emerald-50 cursor-pointer hover:-translate-y-1 transition-transform border-2 border-transparent hover:border-indigo-600">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold">🔬</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Science</h3>
          <p className="text-gray-600 text-sm mb-6">{quizData.science.length} Questions about nature and the universe.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">Level {student.grade}</span>
            <button className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-emerald-600 transition-colors">Start Test</button>
          </div>
        </div>

        <div onClick={() => handleStartQuiz('english')} className="p-6 rounded-3xl bg-orange-50 cursor-pointer hover:-translate-y-1 transition-transform border-2 border-transparent hover:border-indigo-600">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold">Aa</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">English Grammar</h3>
          <p className="text-gray-600 text-sm mb-6">{quizData.english.length} Questions on vocabulary and spelling.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">Level {student.grade}</span>
            <button className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-orange-600 transition-colors">Start Test</button>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-purple-50 border-dashed border-2 border-purple-200 opacity-60">
          <div className="w-14 h-14 bg-purple-300 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold">🌎</div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">Social Studies</h3>
          <p className="text-gray-400 text-sm mb-6">New modules arriving next week.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
            <button className="px-6 py-2 bg-gray-200 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">Locked</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderQuizScreen = () => {
    const qObj = quizData[selectedSubject][currentQuestion];
    const totalQs = quizData[selectedSubject].length;
    const progress = ((currentQuestion + 1) / totalQs) * 100;

    return (
      <motion.div
        key={`quiz-${currentQuestion}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="flex-1 flex flex-col w-full h-full max-w-2xl mx-auto"
      >
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1 capitalize">{selectedSubject} Test</h2>
            <p className="text-gray-500 font-medium tracking-wide">Question {currentQuestion + 1} of {totalQs}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Score</div>
            <div className="text-4xl font-black text-indigo-600 leading-none">{score}</div>
          </div>
        </header>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-10 overflow-hidden">
          <motion.div 
            className="bg-indigo-600 h-2 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-8 leading-tight min-h-[64px]">
            {qObj.q}
          </h3>

          <div className="space-y-4">
            {qObj.options.map((opt, i) => {
              let btnClass = "border-2 border-gray-100 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 cursor-pointer hover:-translate-y-0.5 shadow-sm hover:shadow-md";
              let icon = null;
              
              if (selectedAnswer !== null) {
                if (opt === qObj.answer) {
                  btnClass = "border-2 border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm translate-y-0";
                  icon = <CheckCircle2 className="text-emerald-500" size={24} />;
                } else if (opt === selectedAnswer) {
                  btnClass = "border-2 border-red-500 bg-red-50 text-red-800 shadow-sm translate-y-0";
                  icon = <XCircle className="text-red-500" size={24} />;
                } else {
                  btnClass = "border-2 border-gray-100 bg-gray-50 text-gray-400 opacity-60 translate-y-0";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(opt)}
                  disabled={selectedAnswer !== null}
                  className={`w-full px-6 py-5 rounded-2xl text-left transition-all flex items-center justify-between font-bold text-xl ${btnClass}`}
                >
                  {opt}
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 h-16 flex justify-end">
          {selectedAnswer !== null && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <button
                onClick={handleNextQuestion}
                className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-colors cursor-pointer"
              >
                {currentQuestion < totalQs - 1 ? 'Next Question' : 'Finish Test'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderResultScreen = () => {
    const totalQs = quizData[selectedSubject].length;
    const percentage = Math.round((score / totalQs) * 100);
    
    let message = "Good effort!";
    let color = "text-orange-500";
    let strokeColor = "#f97316";
    if (percentage === 100) { 
      message = "Perfect Score!"; 
      color = "text-emerald-500"; 
      strokeColor = "#10b981";
    }
    else if (percentage >= 75) { 
      message = "Great Job!"; 
      color = "text-blue-500"; 
      strokeColor = "#3b82f6";
    }

    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center text-center w-full h-full"
      >
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-xs">
            {selectedSubject} TEST COMPLETE
          </span>
        </div>
        
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Final Results</h2>
        
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" stroke={strokeColor} strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 45) * (1 - score / totalQs) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-6xl font-black text-gray-900 leading-none">{score}</span>
            <span className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">out of {totalQs}</span>
          </div>
        </div>

        <h3 className={`text-3xl font-extrabold mb-3 ${color}`}>{message}</h3>
        <p className="text-gray-500 text-lg mb-12 max-w-md">
          Well done, <span className="font-bold text-gray-700">{student.name}</span>! 
          You scored {percentage}% on this quiz. Review your score and practice again to improve.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setScreen('subject')}
            className="px-8 py-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-lg rounded-2xl transition-colors cursor-pointer"
          >
            More Subjects
          </button>
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-gray-900 text-white hover:bg-black font-bold text-lg rounded-2xl transition-colors cursor-pointer"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50/50 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[1024px] min-h-[680px] bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[260px] bg-indigo-600 p-8 md:p-10 text-white flex flex-col shrink-0 relative">
          <div className="space-y-12 flex-1">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">Smart Learning</h1>
              <div className="h-1 w-12 bg-indigo-300 rounded"></div>
            </div>
            
            {/* Progress stepper */}
            <nav className="space-y-8 hidden md:block">
              {renderStep('Student Info', 'start')}
              {renderStep('Subject Selection', 'subject')}
              {renderStep('Test Attempt', 'quiz')}
              {renderStep('Final Results', 'result')}
            </nav>
          </div>

          {/* Student Profile snippet */}
          {student.name && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-700 bg-opacity-40 p-5 rounded-2xl hidden md:block mt-8"
            >
              <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest mb-1.5">Student Profile</p>
              <p className="text-lg font-bold leading-tight truncate">{student.name}</p>
              <p className="text-sm font-medium text-indigo-200 mt-0.5">Grade {student.grade}</p>
            </motion.div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 md:p-12 relative flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {screen === 'start' && renderStartScreen()}
            {screen === 'subject' && renderSubjectScreen()}
            {screen === 'quiz' && renderQuizScreen()}
            {screen === 'result' && renderResultScreen()}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-auto pt-8 border-t border-gray-100 hidden md:flex justify-between items-center -mb-2">
            <div className="flex gap-6">
              <div className="flex items-center text-sm font-bold text-gray-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                System Online
              </div>
              <div className="flex items-center text-sm font-bold text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></div>
                API Connected
              </div>
            </div>
            
            {(screen !== 'start') && (
              <button onClick={handleRestart} className="text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors cursor-pointer">
                Reset Session
              </button>
            )}
          </footer>
        </main>

      </div>
    </div>
  );
}
