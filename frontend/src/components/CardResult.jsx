import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import testData from "../mock_data/out.json";

function CardResult() {
  return testData.map((data) => (
    <Card style={{ width: "18rem" }} key={data.id}>
      <Card.Img variant="top" src={data.preview_url} />
      <Card.Body>
        <Card.Title>{data.title}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{`providor: ${
          Object.keys(data.api_data)[0]
        }`}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href={data.img_url}>Card Link</Card.Link>
      </Card.Body>
    </Card>
  ));
}

export default CardResult;
