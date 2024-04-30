import React, { useState, useEffect, useCallback } from "react";

const HealthActivities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [activityLoaded, setActivityLoaded] = useState(false);

  const fetchActivity = async (id) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/activities/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch activity data");
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching activity data: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleButtonClick = useCallback(async (id) => {
    try {
      const nextId = id === 10 ? 1 : id === 0 ? 10 : id;
      const activity = await fetchActivity(nextId);
      if (activity) {
        setCurrentId(nextId);
        setActivities([activity]);
        setActivityLoaded(true);
      }
    } catch (error) {
      console.error("Error handling button click: ", error);
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    if (!activityLoaded) {
      handleButtonClick(currentId);
    }
  }, [activityLoaded, currentId, handleButtonClick]);

  return (
    <div className="activity-container">
      <h2>Choose an activity:</h2>
      <div className="buttons-container">
        <button onClick={() => handleButtonClick(currentId - 1)}>
          Previous Activity
        </button>
        <button onClick={() => handleButtonClick(currentId + 1)}>
          Next Activity
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {activities.map((activity, index) => (
        <div className="activity" key={index}>
          <h3>{activity.activityName}</h3>
          <p>{activity.describe}</p>
          <p>What you need: {activity.whatWeNeed}</p>
          <p>
            Burned calories: {activity.burnedCalories.low} -{" "}
            {activity.burnedCalories.high} kcal
          </p>
        </div>
      ))}
    </div>
  );
};

export default HealthActivities;
