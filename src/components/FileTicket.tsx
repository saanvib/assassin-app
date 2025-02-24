import { useState } from "react";

function FileTicket() {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(`The name you entered was: ${inputValue}`);
  };

  return (
    <>
      <nav className="navbar">
        <h1 className="app-name">ASSASSIN</h1>
        <div className="username">Username</div>
      </nav>
      <form onSubmit={handleSubmit}>
        <label>
          Enter complaint:
          <input
            type="text"
            value={inputValue}
            defaultValue="Enter here..."
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <input type="submit" />
      </form>
    </>
  );
}

export default FileTicket;
