import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-amber-600 ">hello world</div>
      <Button>clicks me</Button>
    </>
  );
}

export default App;
