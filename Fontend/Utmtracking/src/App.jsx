import { useState } from 'react'
import ShortenUrl from './ShortenUrl'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
 

function App() {
 
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<ShortenUrl/>}/>
      </Routes>
     </Router>
    </>
  )
}

export default App
