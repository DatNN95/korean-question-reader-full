"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function KoreanQuestionReader() {
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    // Kiểm tra nếu đang chạy trên trình duyệt
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        const koreanVoices = allVoices.filter(
          (v) => v.lang.startsWith("ko") && v.localService
        );

        setVoices(koreanVoices);
        if (koreanVoices.length > 0) {
          setSelectedVoice(koreanVoices[0]);
        }
      };

      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speakKorean = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = rate;
      utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStart = () => {
    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    setQuestions(lines);
    if (lines.length > 0) {
      const randomIndex = Math.floor(Math.random() * lines.length);
      const question = lines[randomIndex];
      setCurrentQuestion(question);
      speakKorean(question);
    }
  };

  const handleNext = () => {
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const question = questions[randomIndex];
      setCurrentQuestion(question);
      speakKorean(question);
    }
  };

  const handleReplay = () => {
    if (currentQuestion) {
      speakKorean(currentQuestion);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Korean Question Reader</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Chọn giọng đọc tiếng Hàn:</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const voice = voices.find((v) => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Chọn tốc độ đọc:</label>
          <div className="flex justify-center gap-4">
            {[0.5, 0.75, 1].map((value) => (
              <Button
                key={value}
                onClick={() => setRate(value)}
                variant={rate === value ? "default" : "outline"}
              >
                {value}x
              </Button>
            ))}
          </div>
        </div>
      </div>

      {!questions.length && (
        <div className="space-y-2">
          <Textarea
            rows={10}
            placeholder="Nhập danh sách câu hỏi tiếng Hàn, mỗi dòng một câu."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button onClick={handleStart}>Bắt đầu luyện nghe</Button>
        </div>
      )}

      {currentQuestion && (
        <Card>
          <CardContent className="p-4 text-center space-y-4">
            <p className="text-xl font-medium">{currentQuestion}</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Button onClick={handleReplay} variant="outline">🔁 Nghe lại</Button>
              <Button onClick={handleNext}>✅ Đã trả lời xong - Câu tiếp theo</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
