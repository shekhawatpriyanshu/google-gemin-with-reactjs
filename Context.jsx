import { createContext, useState, useCallback, useMemo } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = useCallback(
    async (prompt) => {
      setResultData("");
      setLoading(true);
      setShowResult(true);
      try {
        let response;
        if (prompt !== undefined) {
          response = await run(prompt);
          setRecentPrompt(prompt);
        } else {
          setPrevPrompts((prev) => [...prev, input]);
          setRecentPrompt(input);
          response = await run(input);
        }

        // Typing effect logic
        let responseArray = response.split("**");

        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
          if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
          } else {
            newResponse += "<b>" + responseArray[i] + "</b>";
          }
        }

        let newResponse2 = newResponse.split("*").join("<br/>");
        let newResponseArray = newResponse2.split("");

        for (let i = 0; i < newResponseArray.length; i++) {
          const nextWord = newResponseArray[i];
          delayPara(i, nextWord + "");
        }
      } catch (error) {
        console.error("Error in onSent function:", error);
      } finally {
        setLoading(false);
        setInput("");
      }
    },
    [input, run] // Including run in dependencies if it may change
  );

  // Memoized context value to avoid re-renders
  const contextValue = useMemo(
    () => ({
      prevPrompts,
      setPrevPrompts,
      onSent,
      setRecentPrompt,
      recentPrompt,
      showResult,
      loading,
      resultData,
      input,
      setInput,
      newChat
    }),
    [prevPrompts, recentPrompt, showResult, loading, resultData, input, setPrevPrompts] // Including setPrevPrompts dependency
  );

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
