import React, { useState, useEffect, useCallback } from "react";

const HealthReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [receiptLoaded, setReceiptLoaded] = useState(false);

  const fetchReceipt = async (id) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/receipts/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch receipt data");
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching receipt data: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleButtonClick = useCallback(async (id) => {
    try {
      const nextId = id === 10 ? 1 : id === 0 ? 10 : id;
      const receipt = await fetchReceipt(nextId);
      if (receipt) {
        setCurrentId(nextId);
        setReceipts([receipt]);
        setReceiptLoaded(true);
      }
    } catch (error) {
      console.error("Error handling button click: ", error);
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    if (!receiptLoaded) {
      handleButtonClick(currentId);
    }
  }, [receiptLoaded, currentId, handleButtonClick]);

  return (
    <div className="receipt-container">
      <h2>Choose a recipe:</h2>
      <div className="buttons-container">
        <button onClick={() => handleButtonClick(currentId - 1)}>
          Previous Recipe
        </button>
        <button onClick={() => handleButtonClick(currentId + 1)}>
          Next Recipe
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {receipts.map((receipt, index) => (
        <div className="receipt" key={index}>
          <h3>{receipt.receiptName}</h3>
          <p>{receipt.ingredients.join(", ")}</p>
          <p>{receipt.procedure.join(", ")}</p>
        </div>
      ))}
    </div>
  );
};

export default HealthReceipts;
