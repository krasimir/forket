export default function Header() {
    return (<header className="mx-auto flex space-between my2" style={{
        width: "240px"
    }}>
      <img src="/assets/webpack.svg" alt="Webpack logo" style={{
        width: "100px"
    }}/>
      <img src="/assets/react.svg" alt="React logo" style={{
        width: "100px"
    }}/>
    </header>);
}
