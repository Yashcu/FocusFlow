import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { StopwatchProvider } from "./contexts/StopwatchContext";
import Routes from "./Routes";

function App() {
  return (
    <AuthProvider>
      <StopwatchProvider>
        <Routes />
      </StopwatchProvider>
    </AuthProvider>
  );
}

export default App;
