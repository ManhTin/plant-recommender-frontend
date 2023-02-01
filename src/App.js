import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './pages/Auth'
import { Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SetupProfile from "./pages/SetupProfile";
import Recommendations from "./pages/Recommendations";

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthTest/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/setupProfile" element={<SetupProfile/>} />
        <Route path="/recommend" element={<Recommendations/>} />
    </Routes>
  </BrowserRouter>
  </ThemeProvider>
  );
}


export function AuthTest({ pb }) {
  return(
    <>
    <Navigate to="/setupProfile"/> 
    {/*pb.authStore.isValid ? <Navigate to="/home" state={{pb: pb}}/> : <Navigate to="/auth" state={{pb: pb}}/>*/}
    </>
  )
}

export default App;
