import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState("8053672909258");
  const [vtoMode, setVtoMode] = useState("live");
  const [isVtoActive, setIsVtoActive] = useState(false);
  const [uiStatus, setUiStatus] = useState("");

  // Use useCallback to memoize functions that are used in effects
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
    // Create a stable reference to the hide function
    const handleStopVto = () => {
      hide();
      console.log("VTO stopped");
    };

    const handleUiStatus = (status) => {
      console.log("UI Status:", status);
      setUiStatus(status);
      if (status === "ready") {
        setIsLoading(false);
        console.log("VTO module is ready.");
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
      // You could download or display the photo here
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
      
      // Only use supported callback methods
      onStopVto: handleStopVto,
      onIssue: handleIssue,
      onUiStatus: handleUiStatus,
      onMode: handleMode,
      onLiveStatus: handleLiveStatus,
      onSnapshot: handleSnapshot,
      onRenderResult: handleRenderResult,
      
      // Configuration options
      language: "en",
      showCloseButton: true,
      enablePhotoCapture: true,
      enableFrameSuggestions: true,
      enableTrying: true,
      enableVto: true,
      enableHeadDetection: true,
      debug: false,
    };

    window.fitmixInstance = window.FitMix.createWidget(
      "fitmix-container",
      params
    );

    return () => {
      // Cleanup when component unmounts
      if (window.fitmixInstance) {
        window.fitmixInstance.stopVto();
      }
    };
  }, [currentFrame, hide]); // Add dependencies

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

  const takePhoto = () => {
    if (window.fitmixInstance && window.fitmixInstance.takePhoto) {
      window.fitmixInstance.takePhoto();
    }
  };

  const changeModel = (modelId) => {
    if (window.fitmixInstance && window.fitmixInstance.setModel) {
      window.fitmixInstance.setModel(modelId);
    } else {
      console.warn("setModel method not available in this API version");
    }
  };

  const resetView = () => {
    if (window.fitmixInstance && window.fitmixInstance.resetView) {
      window.fitmixInstance.resetView();
    } else {
      console.warn("resetView method not available in this API version");
    }
  };

  const toggleDebug = () => {
    if (window.fitmixInstance && window.fitmixInstance.setConfig) {
      const currentDebug = window.fitmixInstance.getConfig?.().debug || false;
      window.fitmixInstance.setConfig({ debug: !currentDebug });
    } else {
      console.warn("setConfig method not available in this API version");
    }
  };

  const getSuggestions = () => {
    if (window.fitmixInstance && window.fitmixInstance.getSuggestions) {
      window.fitmixInstance.getSuggestions()
        .then(suggestions => {
          console.log("Frame suggestions:", suggestions);
        })
        .catch(error => {
          console.error("Error getting suggestions:", error);
        });
    } else {
      console.warn("getSuggestions method not available in this API version");
    }
  };

  const getFaceShape = () => {
    if (window.fitmixInstance && window.fitmixInstance.getFaceshape) {
      window.fitmixInstance.getFaceshape()
        .then(faceShape => {
          console.log("Face shape:", faceShape);
          alert(`Your face shape is: ${faceShape}`);
        })
        .catch(error => {
          console.error("Error getting face shape:", error);
        });
    } else {
      console.warn("getFaceshape method not available in this API version");
    }
  };

  return (
    <div className="wrapper">
      <h1>FittingBox VTO Experience</h1>
      
      {isLoading && <div className="loading">Loading VTO...</div>}
      
      <div className="status">UI Status: {uiStatus}</div>
      
      <div className="controls">
        <h2>Frame Selection</h2>
        <div className="frame-buttons">
          <button onClick={() => changeFrame("8053672909258")}>
            Sample frame 1
          </button>
          <button onClick={() => changeFrame("0888392486523")}>
            Sample frame 2
          </button>
          <button onClick={() => changeFrame("8056597233958")}>
            Sample frame 3
          </button>
        </div>

        <h2>VTO Mode</h2>
        <div className="mode-buttons">
          <button 
            className={vtoMode === "live" ? "active" : ""}
            onClick={() => openVto("live")}
          >
            Live VTO
          </button>
          <button 
            className={vtoMode === "photo" ? "active" : ""}
            onClick={() => openVto("photo")}
          >
            Photo VTO
          </button>
          <button 
            className={vtoMode === "trying" ? "active" : ""}
            onClick={() => openVto("trying")}
          >
            Trying Mode
          </button>
        </div>

        <h2>Actions</h2>
        <div className="action-buttons">
          <button onClick={takePhoto} disabled={!isVtoActive}>
            Take Photo
          </button>
          <button onClick={resetView} disabled={!isVtoActive}>
            Reset View
          </button>
          <button onClick={getSuggestions}>
            Get Suggestions
          </button>
          <button onClick={getFaceShape}>
            Get Face Shape
          </button>
          <button onClick={toggleDebug}>
            Toggle Debug
          </button>
          <button onClick={stopVto} disabled={!isVtoActive}>
            Stop VTO
          </button>
        </div>
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