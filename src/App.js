
import CustomSlider from './components/custom-slider';

function App() {

  //TODO: [Год, месяц]
  const maxDate = [2021, 4];
  const minDate = [2022, 9];
  return (
    <div className="App">
      <CustomSlider maxDate={maxDate} minDate={minDate} />
    </div>
  );
}

export default App;
