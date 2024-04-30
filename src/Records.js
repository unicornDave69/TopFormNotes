import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button"; // import Button z react-bootstrap

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
      <h2>All Records:</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Card style={{ width: "18rem" }}>
        <Card.Header>Featured</Card.Header>
        <ListGroup variant="flush">
          {records.map((record) => (
            <ListGroup.Item key={record.id}>
              <div>Date: {record.date}</div>
              <div>Set Calorie Budget: {record.setCalorieBudget}</div>
              <div>Consumed Calories: {record.consumedCalories}</div>
              <div>Burned Calories: {record.burnedCalories}</div>
              <div>Result: {record.result}</div>
              <Button variant="danger" onClick={() => handleShowModal(record)}>
                Delete Record
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteRecord}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Records;
