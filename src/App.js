import { useEffect, useState } from "react";
import Gallery from "./Gallery";
import allPhotos from "./photos";
import "./App.css";

export default function App() {
  const [photosDisplayed, setPhotosDisplayed] = useState([]);

  const addPhotos = () => {
    allPhotos.forEach((photo, index) => {
      setTimeout(() => {
        setPhotosDisplayed((prevState) => [...prevState, photo]);
      }, 1000 * index);
    });
  };

  useEffect(() => {
    addPhotos();
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          setPhotosDisplayed([]);
          addPhotos();
        }}
      >
        Reset
      </button>
      <Gallery photos={photosDisplayed} allPhotos={allPhotos} />
    </div>
  );
}
