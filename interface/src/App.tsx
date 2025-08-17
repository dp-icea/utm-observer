import { Providers } from "./app/providers";
import { AppRouter } from "./app/routing";

const App = () => (
  <Providers>
    <AppRouter />
  </Providers>
);

export default App;
