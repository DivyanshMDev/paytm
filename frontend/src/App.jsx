import { Route } from "express"

function App() {

  return (
    <div>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          </Routes>
          </BrowserRouter>
    </div>
  )
}

export default App
