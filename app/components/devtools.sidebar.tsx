import React, { useState, useEffect } from "react";
import "./sidebar.css";

const DevToolsSidebar = () => {
  const [activeTab, setActiveTab] = useState("console");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [networkOutput, setNetworkOutput] = useState("");

  useEffect(() => {
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const captureConsole =
      (type: string) =>
      (...args: any[]) => {
        setConsoleOutput((prev) => `${prev}[${type}] ${args.join(" ")}\n`);
        if (type === "log") originalConsoleLog(...args);
        if (type === "error") originalConsoleError(...args);
        if (type === "warn") originalConsoleWarn(...args);
      };

    console.log = captureConsole("log");
    console.error = captureConsole("error");
    console.warn = captureConsole("warn");

    // Capture network requests
    const originalFetch = window.fetch;
    typeof window != "undefined" &&
      // @ts-ignore
      (window.fetch = async (input: RequestInfo, init?: RequestInit) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(input, init);
          const endTime = performance.now();
          setNetworkOutput(
            (prev) =>
              `${prev}[${new Date().toLocaleTimeString()}] ${input.toString()} - ${
                response.status
              } ${response.statusText} (${(endTime - startTime).toFixed(
                2
              )}ms)\n`
          );
          return response;
        } catch (error) {
          const endTime = performance.now();
          setNetworkOutput(
            (prev) =>
              `${prev}[${new Date().toLocaleTimeString()}] ${input.toString()} - Failed (${(
                endTime - startTime
              ).toFixed(2)}ms)\n`
          );
          throw error;
        }
      });

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.fetch = originalFetch;
    };
  }, []);

  const showTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar">
      <div className="tab" onClick={() => showTab("console")}>
        Console
      </div>
      <div className="tab" onClick={() => showTab("network")}>
        Network
      </div>
      <div className="content">
        {activeTab === "console" && (
          <pre className="output" id="consoleOutput">
            {consoleOutput}
          </pre>
        )}
        {activeTab === "network" && (
          <pre className="output" id="networkOutput">
            {networkOutput}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DevToolsSidebar;
