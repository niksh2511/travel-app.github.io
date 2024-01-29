export const getCityNameById = (id, arr) => {

    return arr.find(currElem => parseInt(currElem.id) === parseInt(id))?.name ?? "Null";
}