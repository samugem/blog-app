import React, { Dispatch, SetStateAction, useState } from "react";
import "./App.css";
import Main from "./Main";
import Admin from "./Admin";
import Editor from "./Editor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = (): React.ReactElement => {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<number>(-1);
  const [username, setUsername] = useState<string>("");
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              username={username}
              setUsername={setUsername}
            />
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <Admin
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
              username={username}
              setUsername={setUsername}
            />
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
