import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState("8053672909258");
  const [vtoMode, setVtoMode] = useState("live");
  const [isVtoActive, setIsVtoActive] = useState(false);
  const [uiStatus, setUiStatus] = useState("");

  const hide = useCallback(() => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "none";
      setIsVtoActive(false);
    }
  }, []);

  const show = useCallback(() => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "block";
    }
  }, []);

  useEffect(() => {
    const handleStopVto = () => {
      hide();
      console.log("VTO stopped");
    };

    const handleUiStatus = (status) => {
      console.log("UI Status:", status);
      setUiStatus(JSON.stringify(status)); // 👈 यहाँ object को string बना कर state में डालो
      if (status.loadingIndicator === false) {
        setIsLoading(false);
      }
    };

    const handleMode = (mode) => {
      console.log("Mode changed to:", mode);
      setVtoMode(mode);
    };

    const handleLiveStatus = (status) => {
      console.log("Live status:", status);
      setIsVtoActive(status === "started");
    };

    const handleSnapshot = (photoData) => {
      console.log("Photo taken:", photoData);
    };

    const handleRenderResult = (result) => {
      console.log("Render result:", result);
    };

    const handleIssue = (data) => {
      console.log("Issue:", data);
    };

    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      frame: currentFrame,
      onStopVto: handleStopVto,
      onIssue: handleIssue,
      onUiStatus: handleUiStatus,
      onMode: handleMode,
      onLiveStatus: handleLiveStatus,
      onSnapshot: handleSnapshot,
      onRenderResult: handleRenderResult,
    };

    window.fitmixInstance = window.FitMix.createWidget(
      "fitmix-container",
      params
    );

    return () => {
      if (window.fitmixInstance) {
        window.fitmixInstance.stopVto();
      }
    };
  }, [currentFrame, hide]);

  const openVto = (mode = "live") => {
    if (window.fitmixInstance) {
      window.fitmixInstance.startVto(mode);
      show();
    }
  };

  const stopVto = () => {
    if (window.fitmixInstance) {
      window.fitmixInstance.stopVto();
      hide();
    }
  };

  const changeFrame = (frameId) => {
    if (window.fitmixInstance) {
      window.fitmixInstance.setFrame(frameId);
      setCurrentFrame(frameId);
    }
  };

  return (
    <div className="wrapper">
      <h1>FittingBox VTO Experience</h1>

      {isLoading && <div className="loading">Loading VTO...</div>}

      <div className="status">UI Status: {uiStatus}</div>

      <div className="controls">
        <h2>Frame Selection</h2>
        <button onClick={() => changeFrame("8053672909258")}>
          Sample frame 1
        </button>
        <button onClick={() => changeFrame("0888392486523")}>
          Sample frame 2
        </button>
        <button onClick={() => changeFrame("8056597233958")}>
          Sample frame 3
        </button>

        <h2>VTO Mode</h2>
        <button onClick={() => openVto("live")}>Live VTO</button>
        <button onClick={() => openVto("photo")}>Photo VTO</button>
        <button onClick={() => openVto("trying")}>Trying Mode</button>

        <h2>Actions</h2>
        <button onClick={stopVto} disabled={!isVtoActive}>
          Stop VTO
        </button>
      </div>

      <div
        id="fitmix-container"
        ref={fitmixRef}
        style={{ width: "min(500px,90vw)", height: "400px", display: "none" }}
      ></div>
    </div>
  );
}

export default App;
