import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Homepage() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    dailyCalorieBudget: "",
    consumedCalories: [],
    burnedCalories: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [totalResult, setTotalResult] = useState(0);
  const [totalCalorieBudget, setTotalCalorieBudget] = useState(0);
  const [totalConsumedCalories, setTotalConsumedCalories] = useState(0);
  const [totalBurnedCalories, setTotalBurnedCalories] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const totalCalorieBudget =
      Math.abs(parseInt(formData.dailyCalorieBudget, 10)) || 0;

    const totalConsumedCalories = formData.consumedCalories.reduce(
      (acc, curr) => acc + parseInt(curr.calories, 10),
      0
    );

    const totalBurnedCalories = formData.burnedCalories.reduce(
      (acc, curr) => acc + parseInt(curr.calories, 10),
      0
    );

    const calorieResult = totalConsumedCalories - totalBurnedCalories;
    const totalResult = totalCalorieBudget - calorieResult;

    setTotalResult(totalResult);
    setTotalCalorieBudget(totalCalorieBudget);
    setTotalConsumedCalories(totalConsumedCalories);
    setTotalBurnedCalories(totalBurnedCalories);

    handleShowModal();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleSaveToCalendar = async () => {
    const dataToSend = {
      date: new Date().toISOString().split("T")[0],
      setCalorieBudget: totalCalorieBudget,
      consumedCalories: totalConsumedCalories,
      burnedCalories: totalBurnedCalories,
      result: totalResult,
    };

    try {
      const response = await fetch("http://localhost:5000/records/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to backend.");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error while sending data to backend:", error);
    }
  };

  const handleAddFood = () => {
    setFormData({
      ...formData,
      consumedCalories: [
        ...formData.consumedCalories,
        { name: "", calories: "" },
      ],
    });
  };

  const handleAddActivity = () => {
    setFormData({
      ...formData,
      burnedCalories: [...formData.burnedCalories, { name: "", calories: "" }],
    });
  };

  const handleInputChangeActivity = (index, event) => {
    const { name, value } = event.target;
    const newBurnedCalories = [...formData.burnedCalories];
    newBurnedCalories[index][name] = value;
    setFormData({ ...formData, burnedCalories: newBurnedCalories });
  };

  const handleInputChangeFood = (index, event) => {
    const { name, value } = event.target;
    const newConsumedCalories = [...formData.consumedCalories];
    newConsumedCalories[index][name] = value;
    setFormData({ ...formData, consumedCalories: newConsumedCalories });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Set daily calorie budget:</Form.Label>
            <Form.Control
              type="number"
              name="dailyCalorieBudget"
              onChange={handleInputChange}
              value={formData.dailyCalorieBudget}
              required
            />
          </Form.Group>
        </Row>
        <br />
        <br />
        {formData.consumedCalories.map((food, index) => (
          <Row className="mb-3" key={index}>
            <Form.Group as={Col} md="4">
              <Form.Label>{`Food ${index + 1}`}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={food.name}
                onChange={(event) => handleInputChangeFood(index, event)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>{`Amount of calories for Food ${
                index + 1
              }`}</Form.Label>
              <Form.Control
                type="number"
                name="calories"
                value={food.calories}
                onChange={(event) => handleInputChangeFood(index, event)}
                required
              />
            </Form.Group>
          </Row>
        ))}
        <Button variant="outline-primary" onClick={handleAddFood}>
          Add Food
        </Button>
        <br />
        <br />
        {formData.burnedCalories.map((activity, index) => (
          <Row className="mb-3" key={index}>
            <Form.Group as={Col} md="4">
              <Form.Label>{`Activity ${index + 1}`}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={activity.name}
                onChange={(event) => handleInputChangeActivity(index, event)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>{`Amount of burned calories for Activity ${
                index + 1
              }`}</Form.Label>
              <Form.Control
                type="number"
                name="calories"
                value={activity.calories}
                onChange={(event) => handleInputChangeActivity(index, event)}
                required
              />
            </Form.Group>
          </Row>
        ))}
        <Button variant="outline-primary" onClick={handleAddActivity}>
          Add Activity
        </Button>
        <br />
        <br />
        <Button type="submit" variant="primary">
          Submit form
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Consumed Calories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Total result: {totalResult}</h4>
          <br />
          <p>Set calorie budget: {totalCalorieBudget}</p>
          <p>Consumed calories: {totalConsumedCalories}</p>
          <p>Burned calories: {totalBurnedCalories}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRefreshPage}>
            Refresh records
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close window
          </Button>
          <Button variant="primary" onClick={handleSaveToCalendar}>
            Save to calendar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Homepage;
