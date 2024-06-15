import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/records/get");
        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleShowModal = (record) => {
    setShowModal(true);
    setRecordToDelete(record);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRecordToDelete(null);
  };

  const handleDeleteRecord = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/records/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recordToDelete.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      const updatedRecords = records.filter(
        (record) => record.id !== recordToDelete.id
      );
      setRecords(updatedRecords);
      setLoading(false);
      setShowModal(false);
      setRecordToDelete(null);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="record-container">
      <h2 className="text-center">Tvé záznamy:</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
      {error && <div className="text-center">Error: {error}</div>}
      <Container>
        <Row className="justify-content-center">
          {records.map((record) => (
            <Col key={record.id} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{record.date}</Card.Title>
                  <Card.Text>
                    ⚙️ Nastavený kalorický limit: {record.setCalorieBudget} Kj
                  </Card.Text>
                  <Card.Text>
                    🍔 Snězené kalorie: {record.consumedCalories} Kj
                  </Card.Text>
                  <Card.Text>
                    🏀 Spálené kalorie: {record.burnedCalories} Kj
                  </Card.Text>
                  <Card.Text
                    style={{ textAlign: "center", fontSize: "1.10rem" }}
                  >
                    {" "}
                    {record.result <= 0
                      ? `🔴 ${record.result} Kj nadbytek 🔴`
                      : `🟢 ${record.result} Kj deficit 🟢`}
                  </Card.Text>
                  <div className="text-center">
                    <Button
                      variant="danger"
                      onClick={() => handleShowModal(record)}
                    >
                      Smazat záznam
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Smazat záznam</Modal.Title>
        </Modal.Header>
        <Modal.Body>Jsi si jistý, že chceš záznam smazat?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zpět
          </Button>
          <Button variant="danger" onClick={handleDeleteRecord}>
            Smazat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Records;
