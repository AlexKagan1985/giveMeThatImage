import { useAtomValue } from "jotai";
import Card from "react-bootstrap/Card";
import { NavLink } from "react-router-dom";
import { selectedImageAtom } from "../atoms/imageDetails";
import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
import classes from "./ImageDetails.module.scss";
import axios from "../axios";

function ImageDetails() {
  const image = useAtomValue(selectedImageAtom);

  const hash_id = image.api_data.hash_id;
  
  // special case for artstation image: need to do additional request to get image URL
  const {data: imageUrl, isSuccess, isError} = useQuery(["artstation-image", image.id], async () => {
    if (hash_id) {
      const result = await axios.get(`/artstation_image/${hash_id}`);
      return result.data.cover_url;
    } else {
      return image.img_url;
    }
  });

  console.log("current image: ", image);

  return (
    <>
      {isSuccess ? (
      <div className={classes.container}>
        <Card className={classes.card}>
          <Card.Img variant="top" src={imageUrl} />
          <Card.Body>
            <Card.Text className={classes.title}>Title: {image.title ?? "untitled"}</Card.Text>
            <Card.Text className={classes.author}>
              Author: {image.author_name}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      ) : (
      <div>
        {isError && <p>Error fetching data from the artstation server or backend.</p>}
        <p>No image was selected. Something wrong must have happened. </p>
        <NavLink to="/">Go back</NavLink>
      </div>
      )}
    </>
  );
}

export default ImageDetails;
