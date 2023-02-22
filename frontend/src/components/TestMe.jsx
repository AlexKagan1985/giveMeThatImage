import { useState } from "react";
const TestMe = () => {
  const [val, setVal] = useState('text');
  return (
    <div>
      This is here to verify that testing is working with React and also
      to serve as an example to write unit tests. Feel free to remove this.
      <p>{val}</p>
      <button onClick={() => setVal("Changed text")}>Click me</button>
    </div>
  )
}

export default TestMe
