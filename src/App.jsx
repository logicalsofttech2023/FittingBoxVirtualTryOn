import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup && fitmixRef.current) {
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
          window.fitmixInstance.startVto("live");
        }
      );
    }

    return () => {
      if (window.fitmixInstance) {
        window.fitmixInstance.stopVto();
        window.fitmixInstance = null;
      }
    };
  }, [showPopup]);

  const hide = () => {
    if (fitmixRef.current) {
      fitmixRef.current.style.display = "none";
    }
  };

  const openVto = () => {
    setShowPopup(true);
  };

  const stopVto = () => {
    if (window.fitmixInstance) {
      window.fitmixInstance.stopVto();
    }
    setShowPopup(false);
  };

  const switchCamera = () => {
    window.fitmixInstance?.switchCamera();
  };

  const takeSnapshot = () => {
    window.fitmixInstance?.takeSnapshot();
  };

  const getPD = async () => {
    if (window.fitmixInstance) {
      const pd = await window.fitmixInstance.getPD();
      alert("Your PD: " + JSON.stringify(pd));
    }
  };

  return (
    <div className="wrapper">
      <div>
        <button onClick={() => window.fitmixInstance?.setFrame("8053672909258")}>
          Sample frame 1
        </button>
        <button onClick={() => window.fitmixInstance?.setFrame("0888392486523")}>
          Sample frame 2
        </button>
        <button onClick={() => window.fitmixInstance?.setFrame("8056597233958")}>
          Sample frame 3
        </button>
      </div>

      <button onClick={openVto}>Start VTO</button>

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
