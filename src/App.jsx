import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState("8053672909258");
  const [vtoMode, setVtoMode] = useState("live");
  const [isVtoActive, setIsVtoActive] = useState(false);

  useEffect(() => {
    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      frame: currentFrame,
      onStopVto: hide,
      onIssue: (data) => {
        console.log("Issue:", data);
      },
      // Additional parameters from API documentation
      onReady: () => {
        console.log("VTO module is ready.");
        setIsLoading(false);
      },
      onStartVto: () => {
        console.log("VTO started");
        setIsVtoActive(true);
      },
      onFrameChanged: (frameId) => {
        console.log("Frame changed to:", frameId);
        setCurrentFrame(frameId);
      },
      onModelChanged: (modelId) => {
        console.log("Model changed to:", modelId);
      },
      onPhotoTaken: (photoData) => {
        console.log("Photo taken:", photoData);
        // You could download or display the photo here
      },
      language: "en", // Set language (en, fr, etc.)
      showCloseButton: true, // Show close button in the widget
      enablePhotoCapture: true, // Enable photo capture feature
      enableFrameSuggestions: true, // Enable frame suggestions
      enableTrying: true, // Enable trying mode
      enableVto: true, // Enable VTO mode
      enableHeadDetection: true, // Enable head detection
      debug: false, // Enable debug mode
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
    setVtoMode(mode);
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
    window.fitmixInstance.setModel(modelId);
  };

  const resetView = () => {
    window.fitmixInstance.resetView();
  };

  const toggleDebug = () => {
    const currentDebug = window.fitmixInstance.getConfig().debug;
    window.fitmixInstance.setConfig({ debug: !currentDebug });
  };

  const getSuggestions = () => {
    window.fitmixInstance.getSuggestions()
      .then(suggestions => {
        console.log("Frame suggestions:", suggestions);
        // You could display these suggestions in your UI
      })
      .catch(error => {
        console.error("Error getting suggestions:", error);
      });
  };

  return (
    <div className="wrapper">
      <h1>FittingBox VTO Experience</h1>
      
      {isLoading && <div className="loading">Loading VTO...</div>}
      
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
          <button onClick={toggleDebug}>
            Toggle Debug
          </button>
        </div>

        <h2>Model Selection</h2>
        <div className="model-buttons">
          <button onClick={() => changeModel("default")}>
            Default Model
          </button>
          {/* Add more model IDs as needed */}
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