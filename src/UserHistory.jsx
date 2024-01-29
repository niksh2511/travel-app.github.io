import React, { useState, useEffect } from "react";
import Dropdown from "./Components/Dropdown";
import Table from "./Components/Table";
import { DropdownModel } from "./utils/models/dropdown.Model";
import { localStorageKeys } from "./utils/enums/localStorageEnum";

function UserHistory() {
  const [usernames, setUsernames] = useState([]);
  const [userHistoryData, setUserHistoryData] = useState([]);
  // const [selectedUser, setSelectedUser] = useState([])

  useEffect(() => {
    const flightHistoryData = JSON.parse(
      localStorage.getItem(localStorageKeys.bookFlightHistory)
    );

    let uniqueUsernames = [];
    flightHistoryData.forEach(function (entry) {
      if (!uniqueUsernames.includes(entry.personName)) {
        uniqueUsernames.push(entry.personName);
      }
    });

    uniqueUsernames = uniqueUsernames.map(x => new DropdownModel(x, x))

    uniqueUsernames.unshift(new DropdownModel("", "All"));

    setUsernames(uniqueUsernames);
  }, []);

  useEffect(() => {
    const HistoryData = JSON.parse(
      localStorage.getItem(localStorageKeys.bookFlightHistory)
    );

    setUserHistoryData(HistoryData)
  }, [])



  const handleUserSelect = (dropdownSelectedName) => {
  
    const selectedUserData = JSON.parse(
      localStorage.getItem(localStorageKeys.bookFlightHistory)
    ).filter((name) => name.personName.includes( dropdownSelectedName));
  
    setUserHistoryData(selectedUserData);
  };
  
  return (
    <>
      <Dropdown
        id="UserDropdown"
        label="Select User"
        options={usernames}
        onSelect={handleUserSelect}
      />

      {userHistoryData.length > 0 && (
        <Table
          headers={[
            "PNR",
            "flightName",
            "personName",
            "numberOfPerson",
            "total",
          ]}
          data={userHistoryData}
        />
      )}
    </>
  );
}

export default UserHistory;
