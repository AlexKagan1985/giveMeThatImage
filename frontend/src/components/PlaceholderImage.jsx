import { useState } from "react";

function PlaceholderImage({src, ...props}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{position: "relative"}}>
      {!imageLoaded && <img src="" className="placeholder placeholder-wave" style={{position: "absolute", zIndex: -1}} />}
      <img src={src} {...props} onLoad={() => setImageLoaded(true)} />
    </div>
  )
}

export default PlaceholderImage;