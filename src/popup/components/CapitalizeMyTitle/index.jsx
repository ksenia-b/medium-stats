import React from 'react';
import styles from './styles.module.css';
import { AiOutlineCopy } from "react-icons/ai";

const CAPITALIZATION_OPTIONS = {
  TITLE_CASE: 'Title Case',
  SENTENCE_CASE: 'Sentence case',
  UPPERCASE: 'UPPERCASE',
  LOWERCASE: 'lowercase',
  FIRST_LETTERS: 'First Letters',
  AIT_CASE: 'AIT CaSe',
  TOGGLE: 'tOGGLE',
};

function toAPATitleCase(text) {
  // Words to be capitalized in lowercase
  const lowercaseWords = [
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'
  ];

  // Split the text into words
  let words = text.split(' ');

  // Capitalize the first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Capitalize subsequent words according to APA style guide
  for (let i = 1; i < words.length; i++) {
    if (!lowercaseWords.includes(words[i].toLowerCase())) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }

  // Join the words back into a single string
  return words.join(' ');
}

const capitalizeText = (text, caseType) => {
  switch (caseType) {
    case CAPITALIZATION_OPTIONS.TITLE_CASE:
      return toAPATitleCase(text);
    case CAPITALIZATION_OPTIONS.SENTENCE_CASE:
      return text.split(/(?<=[.!?])\s/).map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()).join(' ');
    case CAPITALIZATION_OPTIONS.UPPERCASE:
      return text.toUpperCase();
    case CAPITALIZATION_OPTIONS.LOWERCASE:
      return text.toLowerCase();
    case CAPITALIZATION_OPTIONS.FIRST_LETTERS:
      return text.replace(/\b(\w)/g, (s) => s.toUpperCase());
    case CAPITALIZATION_OPTIONS.AIT_CASE:
      return text.replace(/\b(\w)(\w*)/g, (m, p1, p2) => p1.toUpperCase() + p2.toLowerCase());
    case CAPITALIZATION_OPTIONS.TOGGLE:
      return text.split('').map((char) => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('');
    default:
      return text;
  }
};

export const CapitalizeMyTitle = () => {
  const [text, setText] = React.useState('');
  const [caseType, setCaseType] = React.useState(CAPITALIZATION_OPTIONS.TITLE_CASE);
  const textareaRef = React.useRef();

  const handleInputChange = (event) => {
    setText(capitalizeText(event.target.value, caseType));
  };

  const handleCaseTypeChange = (newCaseType) => {
    setCaseType(newCaseType);
    setText(capitalizeText(text, newCaseType));
  };

  const handleCopyClick = () => {
    textareaRef.current.select();
    navigator.clipboard.writeText(textareaRef.current.value);
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <textarea ref={textareaRef} type="text" value={text} onChange={handleInputChange} className={styles.input} />
        <button onClick={handleCopyClick}>
          <AiOutlineCopy size={'30px'}/>
        </button>
      </div>

      <div className={styles.optionsWrapper}>
        {Object.entries(CAPITALIZATION_OPTIONS).map(([key, value]) => (
          <button className={value === caseType ? styles.activeButton : null } key={key} onClick={() => handleCaseTypeChange(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};
