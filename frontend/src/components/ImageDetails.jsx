import React from "react";
import Card from "react-bootstrap/Card";
// import { useParams } from "react-router-dom";
import classes from "./ImageDetails.module.css";

function ImageDetails() {
  // const { id } = useParams();
  // const image = testData.find((image) => image.id === id);
  const image = {
    id: 1,
    title: "test",
    author_name: "test",
    img_url:
      "https://images.unsplash.com/photo-1626120000000-1c1e1e1e1e1e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  };
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
