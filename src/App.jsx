import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      frame: "8053672909258",
      onStopVto: hide,
      onIssue: (data) => {
        console.log("Issue:", data);
      },
      onSnapshot: (snapshot) => {
        console.log("Snapshot taken:", snapshot);
      },
    };

    window.fitmixInstance = window.FitMix.createWidget(
      "fitmix-container",
      params,
      function () {
        console.log("VTO module is ready.");
      }
    );

    return () => {
      if (window.fitmixInstance) {
        window.fitmixInstance.stopVto();
      }
    };
  }, []);

  const hide = () => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "none";
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
    setShowPopup(true);
  };

  const stopVto = () => {
    window.fitmixInstance.stopVto();
    hide();
    setShowPopup(false);
  };

  const switchCamera = () => {
    window.fitmixInstance.switchCamera();
  };

  const takeSnapshot = () => {
    window.fitmixInstance.takeSnapshot();
  };

  const getPD = async () => {
    const pd = await window.fitmixInstance.getPD();
    alert("Your PD: " + JSON.stringify(pd));
  };

  return (
    <div className="wrapper">
      {/* Frame Selection */}
      <div>
        <button onClick={() => window.fitmixInstance.setFrame("8053672909258")}>
          Sample frame 1
        </button>
        <button onClick={() => window.fitmixInstance.setFrame("0888392486523")}>
          Sample frame 2
        </button>
        <button onClick={() => window.fitmixInstance.setFrame("8056597233958")}>
          Sample frame 3
        </button>
      </div>

      {/* Open Popup */}
      <button onClick={() => openVto("live")}>Start Live VTO</button>
      <button onClick={() => openVto("photo")}>Start Photo VTO</button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div
              id="fitmix-container"
              ref={fitmixRef}
              style={{ width: "500px", height: "400px" }}
            ></div>

            <div className="popup-controls">
              <button onClick={switchCamera}>Switch Camera</button>
              <button onClick={takeSnapshot}>Take Snapshot</button>
              <button onClick={getPD}>Get PD</button>
              <button onClick={stopVto}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
