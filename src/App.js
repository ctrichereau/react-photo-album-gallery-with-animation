import * as React from "react";
import Filter from "./Filter";
import Gallery from "./Gallery";
import allPhotos from "./photos";
import "./App.css";

// => Create all tags
const allTags = allPhotos
  .flatMap(({ tags }) => tags || [])
  .filter((value, index, array) => array.indexOf(value) === index)
  .sort();

export default function App() {
  const [tags, setTags] = React.useState(allTags);

  // => FIlter photos list with selected tags
  const photos = allPhotos.filter((photo) =>
    Boolean((photo.tags || []).find((tag) => tags.includes(tag)))
  );

  return (
    <div className="App">
      <Filter
        tags={allTags}
        selected={tags}
        onChange={(selected) => setTags(selected)}
      />

      <Gallery photos={photos} allPhotos={allPhotos} />
    </div>
  );
}
