import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Table } from "reactstrap";

function SurveySession() {
  const params = useParams();
  const [session, setSession] = useState(null);
  useEffect(async () => {
    const response = await axios.get(`/api/v1/surveySessions/${params.id}`);
    setSession(response.data);
  }, []);

  if (!session) {
    return <span>Loading...</span>;
  }

  return (
    <Container>
      <Link to={`/dashboard`}>dashboard</Link>
      <h3>Session {session._id}</h3>
      <h1>User: {session.userName}</h1>
      <h2>Survey: {session.survey.slug}</h2>
      <h5>
        Progress:{" "}
        {session.isCompleted
          ? "Completed"
          : `${Math.round((session.index * 100) / session.questions.length)}%`}
      </h5>
      <hr></hr>
      <Table striped bordered>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Answer</th>
        </tr>
        {session.questions.map((question, index) => {
          return (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{question.question}</td>
              <td>{question.answer || "-"}</td>
            </tr>
          );
        })}
      </Table>
    </Container>
  );
}

export default SurveySession;
