import { useState, useEffect } from "react";

export default function useTypingEffect(texts, speed = 100, pause = 1500) {
  // Ensure we always have an array
  if (!Array.isArray(texts)) {
    texts = [texts];
  }

  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.substring(0, currentCharIndex - 1));
        setCurrentCharIndex(currentCharIndex - 1);
      }, speed / 2);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, speed);
    }

    if (!isDeleting && currentCharIndex === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, texts, speed, pause, currentTextIndex]);

  return displayedText;
}
