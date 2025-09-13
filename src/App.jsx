import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState("8053672909258");
  const [vtoMode, setVtoMode] = useState("live");
  const [isVtoActive, setIsVtoActive] = useState(false);
  const [uiStatus, setUiStatus] = useState("");

  useEffect(() => {
    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      frame: currentFrame,
      
      // Only use supported callback methods
      onStopVto: () => {
        hide();
        console.log("VTO stopped");
      },
      onIssue: (data) => {
        console.log("Issue:", data);
      },
      onUiStatus: (status) => {
        console.log("UI Status:", status);
        setUiStatus(status);
        if (status === "ready") {
          setIsLoading(false);
          console.log("VTO module is ready.");
        }
      },
      onMode: (mode) => {
        console.log("Mode changed to:", mode);
        setVtoMode(mode);
      },
      onLiveStatus: (status) => {
        console.log("Live status:", status);
        setIsVtoActive(status === "started");
      },
      onSnapshot: (photoData) => {
        console.log("Photo taken:", photoData);
        // You could download or display the photo here
      },
      onRenderResult: (result) => {
        console.log("Render result:", result);
      },
      
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
  }, []);

  const hide = () => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "none";
      setIsVtoActive(false);
    }
  };

  const show = () => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "block";
    }
  };

  const openVto = (mode = "live") => {
    window.fitmixInstance.startVto(mode);
    show();
  };

  const stopVto = () => {
    window.fitmixInstance.stopVto();
    hide();
  };

  const changeFrame = (frameId) => {
    window.fitmixInstance.setFrame(frameId);
    setCurrentFrame(frameId);
  };

  const takePhoto = () => {
    window.fitmixInstance.takePhoto();
  };

  const changeModel = (modelId) => {
    // Note: This method might not be available in all API versions
    if (window.fitmixInstance.setModel) {
      window.fitmixInstance.setModel(modelId);
    } else {
      console.warn("setModel method not available in this API version");
    }
  };

  const resetView = () => {
    if (window.fitmixInstance.resetView) {
      window.fitmixInstance.resetView();
    } else {
      console.warn("resetView method not available in this API version");
    }
  };

  const toggleDebug = () => {
    if (window.fitmixInstance.setConfig) {
      const currentDebug = window.fitmixInstance.getConfig?.().debug || false;
      window.fitmixInstance.setConfig({ debug: !currentDebug });
    } else {
      console.warn("setConfig method not available in this API version");
    }
  };

  const getSuggestions = () => {
    if (window.fitmixInstance.getSuggestions) {
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
    if (window.fitmixInstance.getFaceshape) {
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
        </div>

        <h2>Model Selection</h2>
        <div className="model-buttons">
          <button onClick={() => changeModel("default")}>
            Default Model
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