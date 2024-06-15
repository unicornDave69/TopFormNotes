import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

function HealthActivities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/activities/get");
      if (!response.ok) {
        throw new Error("Failed to fetch activity data");
      }
      const data = await response.json();
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity data: ", error.message);
      setError("Failed to fetch activity data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCardClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  return (
    <div className="activity-container">
      <h2 className="text-center">Zdravé pohybové aktivity:</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
      {error && <div className="text-center">Error: {error}</div>}
      <div className="container">
        <div className="row justify-content-center">
          {activities.map((activity) => (
            <div key={activity.id} className="col-md-6 col-lg-4 mb-3">
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    {activity.activityName}
                  </Card.Title>
                  <Card.Text
                    className="text-center"
                    style={{ fontSize: "3rem" }}
                  >
                    {activity.icon}
                  </Card.Text>
                  <div className="text-center">
                    <Button
                      variant="success"
                      onClick={() => handleCardClick(activity)}
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

      <Modal show={selectedActivity !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedActivity && selectedActivity.activityName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedActivity && selectedActivity.describe}</p>
          <p>Potřebné věci: {selectedActivity && selectedActivity.things}</p>
          <p>
            Doporučený web pro více informací:{" "}
            <a
              href={selectedActivity && selectedActivity.places}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedActivity && selectedActivity.places}
            </a>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default HealthActivities;
