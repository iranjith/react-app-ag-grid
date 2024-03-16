import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { useCallback, useMemo, useRef, useState } from "react";

import { createOneCarRecord } from "./carFactory";

var numberFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
var myValueFormatter = (p: { value: number | bigint }) =>
  numberFormatter.format(p.value);

let cars = [...new Array(4)].map(() => createOneCarRecord());

function UpdateGrid() {
  const [rowData, setRowData] = useState(cars);

  const [colDefs, setColDefs] = useState<ColDef[]>([
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Color", field: "color" },
    {
      headerName: "Price",
      field: "price",
      valueFormatter: myValueFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      resizable: true,
    }),
    []
  );

  const gridRef = useRef<any>(null);

  const onInsertOne = useCallback(() => {
    const newRecord = createOneCarRecord();
    cars = [newRecord, ...cars];
    setRowData(cars);
  }, []);

  const onTxInsertOne = useCallback(() => {
    const newRecord = createOneCarRecord();
    const res = gridRef.current.api.applyTransaction({
      add: [newRecord],
    });
    console.log(res);
  }, []);

  const onTxAsyncInsertOne = useCallback(() => {
    const newRecord = createOneCarRecord();
    gridRef.current.api.applyTransactionAsync(
      {
        add: [newRecord],
      },
      (res: any) => {
        console.log(res);
      }
    );
  }, []);

  const getRowId = useCallback((params: { data: { id: any } }) => {
    return params.data.id;
  }, []);

  const onRemove = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map(
      (node: { data: { id: any } }) => node.data.id
    );
    cars = cars.filter((car) => selectedIds.indexOf(car.id) < 0);
    setRowData(cars);
  }, []);

  const onTxRemove = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: { data: any }) => node.data);

    gridRef.current.api.applyTransaction({
      remove: selectedData,
    });
  }, []);

  const onUpdate = useCallback(() => {
    cars = cars.map((car) => {
      if (Math.random() > 0.5) {
        return car;
      }

      return {
        ...car,
        price: car.price + (1000 - Math.floor(Math.random() * 2000)),
      };
    });
    setRowData(cars);
  }, []);

  const onTxUpdate = useCallback(() => {
    const updatedRecords: any[] = [];

    gridRef.current.api.forEachNode((node: { data: any }) => {
      if  (Math.random() > 0.5) {
        return;
      }

      const car = node.data;

      updatedRecords.push({
        ...car,
        price: car.price + (1000 - Math.floor(Math.random() * 2000)),
      });
    });

    gridRef.current.api.applyTransaction({
      update: updatedRecords,
    });
  }, []);

  const onReverse = useCallback(() => {
    cars = [...cars].reverse();
    setRowData(cars);
  }, []);

  const onAsyncTxFlushed = useCallback((e: any) => {
    console.log("=============");
    console.log(e);
    console.log("=============");
  }, []);

  const onFlushAsyncTx = useCallback(() => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);

  return (
    <>
      <div>
        <button onClick={onInsertOne}>Insert One</button>
        <button onClick={onReverse}>Reverse</button>
        <button onClick={onRemove}>Remove Selected</button>
        <button onClick={onUpdate}>Update Some</button>
      </div>
      <div>
        <button onClick={onTxInsertOne}>Tx Insert One</button>
        <button onClick={onTxRemove}>Tx Remove Selected</button>
        <button onClick={onTxUpdate}>Tx Update Some</button>
      </div>
      <div>
        <button onClick={onTxAsyncInsertOne}>Tx Async Insert One</button>
        {/* <button onClick={onFlushAsyncTx}>Flush Async Tx</button> */}
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "400px", width: "600px" }}
      >
        <AgGridReact
          ref={gridRef}
          getRowId={getRowId}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          animateRows={true}
        ></AgGridReact>
      </div>
    </>
  );
}

export default UpdateGrid;
