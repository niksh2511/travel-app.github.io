import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Components/Dropdown";
import Table from "./Components/Table";
import Input from "./Components/Input";
import { getCityNameById } from "./utils/helpers/getCityNameById";
import { fetchData } from "./utils/helpers/fechData";
import "./index.css";
import { DropdownModel } from "./utils/models/dropdown.Model";

const SearchFlight = ({flights, bookFlight}) => {
  const [sourceData, setSourceData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [flightsData, setFlightsData] = useState([]);
  const [flightDataWithNames, setFlightDataWithNames] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [searchFlightByName, setSearchFlightByName] = useState("")

  const [filteredFlights, setFilteredFlights] = useState([]);
  // const { flights, bookFlight } = useFlightState(); 

  const navigate = useNavigate()

  // Data Fetching
  useEffect(() => {
    (async () => {
      setSourceData([new DropdownModel("", "All Cities"),...(await fetchData("/JsonData/Source.json"))]);
      setDestinationData([new DropdownModel("", "All Cities"), ...(await fetchData("/JsonData/Destination.json"))]);
      setFlightsData(await fetchData("/JsonData/Flights.json"));
    })();
  }, []);

  //  retriving cities name from destination and Source 
  useEffect(() => {
    setFlightDataWithNames(
      flights.map((currFlightData) => {
        currFlightData.destinationName = getCityNameById(
          currFlightData.destinationID,
          destinationData
        );

        currFlightData.sourceName = getCityNameById(
          currFlightData.sourceID,
          sourceData
        );

        return currFlightData;
      })
    );
  }, [flightsData]);


  useEffect(() => {
    setFilteredFlights(flightDataWithNames);
  }, [flightDataWithNames]);

  



  // Handling Functions for Source, destinations and Searching
  const handleSource = (selectSource) => {
    setSelectedSource(selectSource);
  };

  const handleDestination = (selectDestination) => {
    setSelectedDestination(selectDestination);
  };

  const handleFlightSearch = (searchFlight) => {
    setSearchFlightByName(searchFlight)
  }

  const handleSearch = () => {

    const matchingFlights = flights.filter((flight) => {

      const sourceMatch =
      flight.sourceID.toString().includes(selectedSource);
      
      console.log(selectedSource)

      const destinationMatch =
        
        flight.destinationID.toString().includes(selectedDestination);

      const flightNameMatch = flight.name.toLowerCase().includes(searchFlightByName.toLowerCase().trim())


      return sourceMatch && destinationMatch && flightNameMatch;
    });

    setFilteredFlights(matchingFlights);
  };
  
    const handleBookClick = (flightID) => {
      navigate(`/book-flight/${flightID}`);
    }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <Dropdown
            id="Source"
            label="Source"
            options={sourceData}
            onSelect={handleSource}
          />
          <Dropdown
            id="Destination"
            label="Destination"
            options={destinationData}
            onSelect={handleDestination}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            name="FlightSearch"
            placeholder="Search Flights"
            id="Search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5"
            onChange={(e) => handleFlightSearch(e.target.value)}
            label="Search Flights: "
          />
        </div>
        <br />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSearch}
      >
        Search
      </button>

      <br />
      <br />

      <Table
        headers={[
          "flightID",
          "name",
          "sourceName",
          "destinationName",
          "price",
          "departureDate",
          "availableSeats"
        ]}
        data={filteredFlights}
        onBookClick={(handleBookClick)}
      />
    </>
  );
};

export default SearchFlight;