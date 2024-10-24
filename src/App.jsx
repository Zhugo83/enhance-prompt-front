import { useState, useEffect } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [typedCount, setTypedCount] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Function to handle form submission
  const handleSubmit = async () => {
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount < 1 && prompt.length > 3) {
      setEnhancedPrompt("Prompt needs at least 1 word and 3 characters");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setDisplayedText("");
    setButtonDisabled(true);
    try {
      const req = await fetch("https://enhance-prompt-back-zeta.vercel.app/enhance", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await req.json();
      setEnhancedPrompt(data.enhancePrompt);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setButtonDisabled(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (!enhancedPrompt) return;

    let index = 0;
    const textToType = enhancedPrompt;
    setDisplayedText("");
    setTypedCount("");

    const interval = setInterval(() => {
      if (index < textToType.length) {
        index++;
        setDisplayedText(textToType.slice(0, index));
        setTypedCount(index + " / " + textToType.length);
      } else {
        clearInterval(interval);
        setTypedCount("");
      }
    }, 10);

    return () => clearInterval(interval);
  }, [enhancedPrompt]);

  const handleCopyClick = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt);
      setCopyMessage("Text copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Welcome to Prompt Enhancer
      </h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full max-w-lg p-2 mb-4 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
        placeholder="Enter the prompt you want to enhance"
        rows="10"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || buttonDisabled}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        {isLoading ? "Enhancing..." : "Enhance"}
      </button>

      <div
        onClick={handleCopyClick}
        className="text-white mt-6 w-full max-w-lg p-4 bg-gray-800 rounded-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
        title="Output text"
      >
        {displayedText || "The output text will be displayed here"}
      </div>
      {typedCount && (
        <p className="text-white mt-2">{typedCount}</p>
      )}

      {copyMessage && (
        <p className="text-green-400 mt-2">{copyMessage}</p>
      )}
    </main>
  );
}

export default App;
