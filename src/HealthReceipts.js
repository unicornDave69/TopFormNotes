import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

function HealthReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/receipts/get");
      if (!response.ok) {
        throw new Error("Failed to fetch receipt data");
      }
      const data = await response.json();
      setReceipts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching receipt data: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleCardClick = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
  };

  return (
    <div className="receipt-container">
      <h2 className="text-center">Zdravé recepty 🥗</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
      {error && <div className="text-center">Error: {error}</div>}
      <div className="container">
        <div className="row justify-content-center">
          {receipts.map((receipt, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-3">
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {receipt.receiptName}
                  </Card.Title>
                  <Card.Text>{receipt.description}</Card.Text>
                  <div className="text-center">
                    <Button
                      variant="success"
                      onClick={() => handleCardClick(receipt)}
                    >
                      Detail
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={selectedReceipt !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedReceipt && selectedReceipt.receiptName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedReceipt && selectedReceipt.description}</p>
          <h5>Ingredience:</h5>
          <ul>
            {selectedReceipt &&
              selectedReceipt.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
          </ul>
          <h5>Postup:</h5>
          <ol>
            {selectedReceipt &&
              selectedReceipt.procedure.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
          </ol>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Energetická hodnota 100g:</th>
              </tr>
            </thead>
            <tbody>
              {selectedReceipt &&
                Object.entries(selectedReceipt.nutritions).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default HealthReceipts;
