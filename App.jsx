import React from 'react'
import Sidebar from './component/Sidebar/Sidebar'
import Main from './component/Main/Main'
const App = () => {
   console.log("REACT API", import .meta.env.REACT_APP_GEMINI_API_KEY);
    return (
   <>
   <Sidebar/>
   <Main/>
   
   </>
  )
}

export default App
