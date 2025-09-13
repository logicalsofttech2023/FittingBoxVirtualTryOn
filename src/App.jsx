import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const apiKey = "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn";

  useEffect(() => {
  const params = {
    apiKey: apiKey,
    frame: "8053672909258",
    onStopVto: () => console.log("Stopped"),
    onIssue: (data) => {
      console.log("Issue:", data);
      if (data.cameraAccessDenied) {
        alert("Camera access denied! Please allow in browser settings.");
      }
    },
    onOpenStream: (result) => {
      console.log("Camera opened:", result);
    },
  };

  window.fitmixInstance = window.FitMix.createWidget(
    "fitmix-container",
    params,
    () => console.log("VTO ready ✅")
  );

  return () => {
    if (window.fitmixInstance) {
      window.fitmixInstance.stopVto();
    }
  };
}, []);


  // ===== Methods wrappers =====
  const startLive = () => window.fitmixInstance.startVto("live");
  const startPhoto = () => window.fitmixInstance.startVto("photo");
  const stopVto = () => window.fitmixInstance.stopVto();
  const restartVto = () => window.fitmixInstance.restartVto();

  const setFrame = (id) => window.fitmixInstance.setFrame(id);
  const setLang = (lang) => window.fitmixInstance.setLang(lang);
  const setPd = (pd) => window.fitmixInstance.setPupillaryDistance(pd);
  const setUser = (data) => window.fitmixInstance.setUserInfo(data);
  const setZoom = (z) => window.fitmixInstance.setZoomFactor(z);
  const toggleAR = (enable) =>
    window.fitmixInstance.setLensesAntireflection(enable);

  const getSnap = () => window.fitmixInstance.getSnapshot();
  const resetDisclaimer = () => window.fitmixInstance.resetDisclaimer();
  const resetSession = () => window.fitmixInstance.resetSession();

  const setCustomCss = () =>
    window.fitmixInstance.addCss(`
      .fbx-btn { background: red !important; }
    `);

  const setPhotoFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      window.fitmixInstance.setTryonPicture(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // =============================
  return (
    <div className="wrapper">
      <h2>FittingBox VTO Full Feature Demo</h2>

      <div className="controls">
        <button onClick={startLive}>Start Live VTO</button>
        <button onClick={startPhoto}>Start Photo VTO</button>
        <button onClick={stopVto}>Stop VTO</button>
        <button onClick={restartVto}>Restart VTO</button>
      </div>

      <div className="frames">
        <button onClick={() => setFrame("8053672909258")}>Frame 1</button>
        <button onClick={() => setFrame("0888392486523")}>Frame 2</button>
        <button onClick={() => setFrame("8056597233958")}>Frame 3</button>
      </div>

      <div className="features">
        <button onClick={() => setLang("fr")}>Set Lang FR</button>
        <button onClick={() => setPd(60)}>Set PD = 60</button>
        <button onClick={() => setUser({ gender: "m", pupillaryDistance: 64 })}>
          Set User Male + PD 64
        </button>
        <button onClick={() => setZoom(1.2)}>Zoom 1.2x</button>
        <button onClick={() => toggleAR(true)}>Enable Anti-reflection</button>
        <button onClick={() => toggleAR(false)}>Disable Anti-reflection</button>
        <button onClick={getSnap}>Take Snapshot</button>
        <button onClick={resetDisclaimer}>Reset Disclaimer</button>
        <button onClick={resetSession}>Reset Session</button>
        <button onClick={setCustomCss}>Apply Custom CSS</button>
      </div>

      <div>
        <label>Upload a photo for Photo Mode: </label>
        <input type="file" accept="image/*" onChange={setPhotoFromFile} />
      </div>

      {snapshot && (
        <div className="snapshot">
          <h3>Snapshot Result</h3>
          <img src={snapshot} alt="snapshot" />
        </div>
      )}

      <div
        id="fitmix-container"
        ref={fitmixRef}
        style={{
          width: "min(500px,90vw)",
          height: "400px",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      ></div>
    </div>
  );
}

export default App;
