import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const TypingMarkdown = ({ text, speed = 1 }:{text:string,speed?:number}) => {
  const [visibleText, setVisibleText] = useState(""); // Incrementally reveal text
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setVisibleText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed); // Speed controls typing delay
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div>
      <ReactMarkdown>{visibleText}</ReactMarkdown>
    </div>
  );
};

export default TypingMarkdown
