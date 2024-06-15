import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

function Homepage() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    dailyCalorieBudget: [],
    consumedCalories: [],
    burnedCalories: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [totalResult, setTotalResult] = useState(0);
  const [totalCalorieBudget, setTotalCalorieBudget] = useState(0);
  const [totalConsumedCalories, setTotalConsumedCalories] = useState(0);
  const [totalBurnedCalories, setTotalBurnedCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setLoading(true);

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

    setLoading(false);

    handleShowModal();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage("");
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const now = new Date();
  const handleSaveToCalendar = async () => {
    const dataToSend = {
      date: `${now.toLocaleDateString("en-GB")} ${now.getHours()}:${(
        "0" + now.getMinutes()
      ).slice(-2)}`,
      setCalorieBudget: totalCalorieBudget,
      consumedCalories: totalConsumedCalories,
      burnedCalories: totalBurnedCalories,
      result: totalResult,
    };

    try {
      setLoading(true);

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
      setSuccessMessage("Data byla úspěšně uložena do záznamů!");
    } catch (error) {
      console.error("Error while sending data to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = () => {
    setFormData({
      ...formData,
      consumedCalories: [
        ...formData.consumedCalories,
        { name: "", calories: 0 },
      ],
    });
  };

  const handleAddActivity = () => {
    setFormData({
      ...formData,
      burnedCalories: [...formData.burnedCalories, { name: "", calories: 0 }],
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
    <Container>
      <style type="text/css">
        {`
          .scrollable-modal-body {
            max-height: 60vh;
            overflow-y: auto;
          }
        `}
      </style>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Label>⚙️ Nastav si denní kalorický budget v Kj:</Form.Label>
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
        {formData.consumedCalories.map((food, index) => (
          <Row className="mb-3 justify-content-center" key={index}>
            <Form.Group as={Col} md="3">
              <Form.Label>{`Jídlo ${index + 1}`}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={food.name}
                onChange={(event) => handleInputChangeFood(index, event)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>{`Nutriční hodnota Kj`}</Form.Label>
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
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button variant="outline-primary" onClick={handleAddFood}>
            Přidat jídlo
          </Button>
        </div>
        <br />
        {formData.burnedCalories.map((activity, index) => (
          <Row className="mb-3 justify-content-center" key={index}>
            <Form.Group as={Col} md="3">
              <Form.Label>{`Aktivita ${index + 1}`}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={activity.name}
                onChange={(event) => handleInputChangeActivity(index, event)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>{`Spálené Kj`}</Form.Label>
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
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button variant="outline-primary" onClick={handleAddActivity}>
            Přidat aktivitu
          </Button>
        </div>
        <br />
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button type="submit" variant="primary">
            Vyhodnotit výsledky
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Snězené kalorie</Modal.Title>
        </Modal.Header>
        <Modal.Body className="scrollable-modal-body">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <h4>
                  {totalResult >= 0 ? (
                    <>Skvěle, dosáhl si {totalResult} Kj deficitu!🤩</>
                  ) : (
                    <>Ale né, dosáhl si {totalResult} Kj nadbytku.😤</>
                  )}
                </h4>
              </div>
              <br />
              <div style={{ textAlign: "center" }}>
                <p>Nastavený kalorický limit: {totalCalorieBudget} Kj</p>
                <p>Snězené kalorie: {totalConsumedCalories} Kj</p>
                <p>Spálené kalorie: {totalBurnedCalories} Kj</p>
              </div>
              {successMessage && (
                <div style={{ textAlign: "center", color: "green" }}>
                  <p>{successMessage}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRefreshPage}>
            Obnovit záznamy
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zavřít okno
          </Button>
          <Button variant="primary" onClick={handleSaveToCalendar}>
            Uložit do záznamů
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Homepage;
