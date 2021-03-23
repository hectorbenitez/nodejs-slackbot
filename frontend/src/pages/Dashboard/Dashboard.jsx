import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  useEffect(async () => {
    const response = await axios.get("/api/v1/surveySessions");
    setSessions(response.data);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <hr></hr>
      <table>
        {sessions.map((session) => {
          return (
            <tr>
              <td>
                <Link to={`surveySessions/${session._id}`}>{session._id}</Link>
              </td>
              <td>{session.userName}</td>
              <td>{session.isCompleted ? "Completed" : "In Progress"}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default Dashboard;
