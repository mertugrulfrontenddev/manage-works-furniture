
import './App.css';
import LotList from './components/LotList';
import { LotProvider } from './context/LotContext';
import LotForm from './components/LotForm'
import "bootstrap/dist/css/bootstrap.min.css"


function App() {
  return (
    <LotProvider>
      <LotForm/>
<LotList/>

    </LotProvider>
   
  );
}

export default App;
