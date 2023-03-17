// import logo from "./logo.svg";
import "./App.css";
import Content from "./view/Content";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Content></Content>
    </Provider>
  );
}

export default App;
