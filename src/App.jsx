import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const fitmixRef = useRef(null);

  useEffect(() => {
    const params = {
      apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
      frame: "8053672909258",
      onStopVto: hide,
      onIssue: (data) => {
        console.log("Issue:", data);
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
      // cleanup when component unmount
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

  const openVto = () => {
    window.fitmixInstance.startVto("live");
    show();
  };

  const stopVto = () => {
    window.fitmixInstance.stopVto();
    hide();
  };

  return (
    <div className="wrapper">
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

      <button onClick={openVto}>Start VTO</button>
      <button onClick={stopVto}>Stop VTO</button>

      <div
        id="fitmix-container"
        ref={fitmixRef}
        style={{ width: "min(500px,90vw)", height: "400px", display: "none" }}
      ></div>
    </div>
  );
}

export default App;
