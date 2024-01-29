import React from "react";
import Input from "./Components/Input";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData } from "./utils/helpers/fechData";
import { v4 as uuidv4 } from 'uuid';


function BookFlight({ setFlights }) {
  const { flightID } = useParams();
  const navigate = useNavigate();
  const [flightData, setFlightData] = useState({
    name: "",
    price: "",
  });
  const [flightBookingForm, setFlightBookingForm] = useState({
    name: "",
    person: "",
    tax: 0,
    total: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    person: "",
    booking: ""
  });
  const [getData, setGetData] = useState({})
 


  const validation = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      person: "",
    };

    if (flightBookingForm.name.trim() == "") {
      newErrors.name = "Name cannot be empty";
      isValid = false;
    }

    const personCount = parseInt(flightBookingForm.person);
    if (isNaN(personCount) || personCount <= 0) {
      newErrors.person = "Enter a valid number of persons";
      isValid = false;
    } else if (personCount > 10) {
      newErrors.person = "Cannot book more than 10 seats";
      isValid = false;
    } else if (personCount > getData.availableSeats) {
      newErrors.booking = "Cannot book more than available seats.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const fetchFlightData = async () => {
      const response = await fetchData(`/JsonData/Flights.json`);
      const selectFlight = response.find(
        (flight) => flight.flightID === parseInt(flightID)
      );
      setFlightData(selectFlight);
    };

    fetchFlightData();
  }, [flightID]);

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights"));
    if (storedFlights) {
      const selectFlight = storedFlights.find(
        (flight) => flight.flightID === parseInt(flightID)
      );

      if (selectFlight) {
        setGetData((prevFlightData) => ({
          ...prevFlightData,
          availableSeats: selectFlight.availableSeats,
        }));
      }
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setFlightBookingForm({
      ...flightBookingForm,
      [name]: value,
    });

    if (name === "person") {
      const personCount = parseInt(value, 10);
      let tax = Math.round(0.1 * personCount * flightData.price);
      if (isNaN(tax)) tax = 0;
      let total = personCount * flightData.price + tax;
      if (isNaN(total)) total = 0;

      setFlightBookingForm({
        ...flightBookingForm,
        [name]: value,
        tax,
        total,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    const bookingData = {
      PNR: uuidv4(),
      flightName: flightData.name,
      personName: flightBookingForm.name,
      numberOfPerson: flightBookingForm.person,
      total: flightBookingForm.total,
    };

    const localStorageList = localStorage.getItem("bookFlightHistory");
    let list = [];
    if (localStorageList) {
      list = [...JSON.parse(localStorageList), bookingData];
    } else {
      list = [bookingData];
    }

    localStorage.setItem("bookFlightHistory", JSON.stringify(list));

    setFlights((prevFlights) =>
      prevFlights.map((flight) =>
        flight.flightID == flightID
          ? {
              ...flight,
              availableSeats:
                flight.availableSeats - parseInt(flightBookingForm.person),
              bookedSeats:
                flight.bookedSeats + parseInt(flightBookingForm.person),
            }
          : flight
      )
    );
    navigate("/flight-history");
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Flight Booking Form</h1>
        <form >
          <Input
            className="my-1"
            type="text"
            name="FlightName"
            placeholder="Flight Name"
            label="Flight Name:"
            onChange={() => {}}
            value={flightData.name}
            id="form"
          />
          <Input
            className="my-1"
            type="text"
            name="Price"
            placeholder="Price"
            label="Price:"
            onChange={() => {}}
            value={flightData.price}
            id="form"
          />
          <Input
            className={`my-1 ${errors.name ? "border-red-500" : ""}`}
            type="text"
            name="name"
            placeholder="Name"
            label="Name:"
            value={flightBookingForm.name}
            onChange={onChange}
            id="form"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <Input
            className={`my-1 ${errors.person ? "border-red-500" : ""}`}
            type="text"
            name="person"
            placeholder="persons"
            onChange={onChange}
            label="No. of Person:"
            value={flightBookingForm.person}
            id="form"
          />
          {errors.person && (
            <p className="text-red-500 text-sm">{errors.person}</p>
          )}
          <Input
            className="my-1"
            type="text"
            name="tax"
            placeholder="Tax"
            onChange={onChange}
            label="Tax(10 %):"
            value={flightBookingForm.tax}
            id="form"
          />
          <Input
            className="my-1"
            type="text"
            name="total"
            onChange={onChange}
            placeholder="TotalPrice"
            label="Total Price with Tax:"
            value={flightBookingForm.total}
            id="form"
          />

          {errors.booking && (
            <p className="text-red-500 text-sm">{errors.booking}</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default BookFlight;
