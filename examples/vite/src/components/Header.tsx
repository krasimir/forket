import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";

export default function Header() {
  return (
    <header className="mx-auto flex space-between my2" style={{ width: "240px" }}>
      <img src={viteLogo} alt="Vite logo" style={{ width: "100px" }} />
      <img src={reactLogo} alt="React logo" style={{ width: "100px" }} />
    </header>
  );
}
