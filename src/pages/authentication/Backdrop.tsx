import logo from "../../assets/images/main/starack-logo.png";

export default function Backdrop() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={logo}
        alt="Starack Logo"
        style={{ width: "40px", marginBottom: "12px" }}
      />
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        Starack
      </h1>
      <p>Version V1.2</p>
    </div>
  );
}
