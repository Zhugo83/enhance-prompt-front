import { useState } from "react"

function App() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const req = await fetch('https://enhance-prompt-back-zeta.vercel.app/enhance', {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })
      const data = await req.json()
      setPrompt(data.enhancePrompt)
      setIsLoading(false)
    } catch (error)
    {      
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
   <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
     <h1 className="text-3xl font-bold mb-6 text-center text-white">Welcome to prompt enhancer</h1>
     <textarea 
       value= {prompt}
       onChange={(e) => setPrompt(e.target.value)}
       className="w-full max-w-lg p-2 mb-4 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800"
       placeholder="Enter your prompt here" 
       rows="10" 
       disabled={isLoading}
     />
     <button 
     onClick={handleSubmit}
     disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
       Enhance
     </button>
   </main>
  )
 }
 
 export default App 