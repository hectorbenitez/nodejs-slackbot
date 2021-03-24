import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Table, Navbar, NavbarBrand, Row, Col, Spinner } from "reactstrap";

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(async () => {
    const response = await axios.get("/api/v1/surveySessions");
    const sessions = response.data;

    setSessions(sessions);

    const completedSessions = sessions.filter(session => session.isCompleted)
    setStats({
      total: sessions.length,
      completed: completedSessions.length
    })
  }, []);

  if(sessions.length === 0) {
    return <Spinner color="primary" />
  }

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/dashboard">Encora Butler</NavbarBrand>
      </Navbar>
      <Container style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <h3>Survey Sessions</h3>
            Total: { stats.total } | Completed: { stats.completed }
            <hr></hr>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>User Name</th>
                  <th>Survey</th>
                  <th>Created at</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  return (
                    <tr>
                      <th scope="row">
                        <Link to={`surveySessions/${session._id}`}>
                          {session._id}
                        </Link>
                      </th>
                      <td>{session.userName}</td>
                      <td>{session.survey.surveyName}</td>
                      <td>{session.createdAt}</td>
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
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
