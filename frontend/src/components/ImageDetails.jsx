import React from "react";
import Card from "react-bootstrap/Card";
import testData from "../mock_data/out.json";
import { useParams } from "react-router-dom";
import classes from "./ImageDetails.module.css";

function ImageDetails() {
  const { id } = useParams();
  const image = testData.find((image) => image.id === id);
  return (
    <>
      <Card className={classes.card}>
        <Card.Img variant="top" src={image.img_url} />
        <Card.Body>
          <Card.Text className={classes.title}>Title: {image.title}</Card.Text>
          <Card.Text className={classes.author}>
            Author: {image.author_name}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ImageDetails;
