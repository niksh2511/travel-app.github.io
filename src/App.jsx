import { useState, useEffect } from "react";
import SearchFlight from "./SearchFlight";
import BookFlight from "./BookFlight";
import UserHistory from "./UserHistory";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchData } from "./utils/helpers/fechData";
import { localStorageKeys } from "./utils/enums/localStorageEnum";

function App() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    if (flights.length === 0){
    fetchFlightsData().then((flights) => setFlights(flights));
    }
  }, [flights]);


  const fetchFlightsData = async () => {
    const response = await fetchData("/JsonData/Flights.json");
    return response;
  };

  useEffect(() => {
    localStorage.setItem("flights", JSON.stringify(flights));


  }, [flights]);

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem(localStorageKeys.flights));
    if (storedFlights) {
      setFlights(storedFlights);
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/book-flight/:flightID" element={<BookFlight  flights={flights} setFlights={setFlights}/>} />

          <Route path="/" element={<SearchFlight flights={flights} />} />

          <Route path="/flight-history" element={<UserHistory/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;