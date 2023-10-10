export default function Login() {
  return (
    <div className="login-container">
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-end",
        }}
      >
      </div>
      <div
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "20% 20%",
          backgroundPositionX: "center",
          backgroundPositionY: "50px",
          height: "100vh",
          width: "50vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <a style={{ textDecoration: "none" }} href="http://localhost:8888">
          <button className="login-btn login-button">
            <h4 className="login-text">Login with spotify</h4>
          </button>
        </a>
      </div>
    </div>
  );
}