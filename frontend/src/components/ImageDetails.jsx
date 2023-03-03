import { useAtomValue } from "jotai";
import Card from "react-bootstrap/Card";
import { NavLink } from "react-router-dom";
import { selectedImageAtom } from "../atoms/imageDetails";
// import { useParams } from "react-router-dom";
import classes from "./ImageDetails.module.css";

function ImageDetails() {
  const image = useAtomValue(selectedImageAtom);

  return (
    <>
      {image ? (
      <Card className={classes.card}>
        <Card.Img variant="top" src={image.img_url} />
        <Card.Body>
          <Card.Text className={classes.title}>Title: {image.title}</Card.Text>
          <Card.Text className={classes.author}>
            Author: {image.author_name}
          </Card.Text>
        </Card.Body>
      </Card>
      ) : (
      <div>
        <p>No image was selected. Something wrong must have happened. </p>
        <NavLink to="/">Go back</NavLink>
      </div>
      )}
    </>
  );
}

export default ImageDetails;
