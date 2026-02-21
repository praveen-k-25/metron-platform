import { Provider } from "react-redux";
import { persistedStore, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

interface props {
  children: React.ReactNode;
}

const AppProvider = ({ children }: props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <BrowserRouter>{children}</BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default AppProvider;
