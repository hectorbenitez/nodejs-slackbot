import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "reactstrap";

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
      <Table striped bordered>
        <tr>
          <th>Session ID</th>
          <th>Username</th>
          <th>Survey</th>
          <th>Progress</th>
        </tr>
        {sessions.map((session) => {
          return (
            <tr>
              <th scope="row">
                <Link to={`surveySessions/${session._id}`}>{session._id}</Link>
              </th>
              <td>{session.userName}</td>
              <td>{session.survey.slug}</td>
              <td>
                {session.isCompleted
                  ? "Completed"
                  : `${Math.round(
                      (session.index * 100) / session.questions.length
                    )}%`}
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

export default Dashboard;
