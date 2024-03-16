import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import React from "react";

function App() {

  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const columnDefs: ColDef[] = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ag-grid.com/example-assets/row-data.json"
        );
        const data = await response.json();
        setRowData(data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  }), []);

  const gridRef = useMemo<any>(() => null, []);

  const cellClickListener = useCallback((event: any) => {
    console.log(event);
  },[]);

  const getGridRef = useCallback(() => {
    if(gridRef.current){
      console.log(gridRef.current.api.getSelectedRows());
    }
  },[])


  return (
    <>
      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "600px" }}
      >
        <button onClick={getGridRef}></button>
        <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} rowSelection="multiple"
          animateRows={true} onCellClicked={cellClickListener} ></AgGridReact>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
export default App;
