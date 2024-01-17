import * as React from "react";
import PhotoAlbum from "react-photo-album";
import { Transition } from "react-transition-group";

function TriggerEffect({ effect }) {
  React.useEffect(effect);
  return null;
}

const OffscreenGallery = React.memo(function OffscreenGallery({
  photos,
  onModelChange,
  ...rest
}) {
  const model = [];

  return (
    <>
      <PhotoAlbum
        layout="masonry"
        columns={3}
        photos={photos}
        componentsProps={{
          containerProps: { style: { height: 0, overflow: "hidden" } },
        }}
        renderContainer={({ containerRef, containerProps, children }) => {
          model.splice(0, model.length);
          return (
            <div ref={containerRef} {...containerProps}>
              {children}
              <TriggerEffect effect={() => onModelChange(model)} />
            </div>
          );
        }}
        renderPhoto={({ photo, layout, imageProps }) => {
          if (!model.find((item) => item.photo === photo)) {
            model.push({ photo, layout, imageProps });
          }
          return (
            <span
              style={{
                width: layout.width,
                height: layout.height,
              }}
            />
          );
        }}
        {...rest}
      />
    </>
  );
});

function Photo({ layout, imageProps, state, duration, nodeRef }) {
  const [lastLayout, setLastLayout] = React.useState(null);
  const [lastImageProps, setLastImageProps] = React.useState(null);

  console.log("log { layout, imageProps, state, duration, nodeRef } : ", {
    layout,
    imageProps,
    state,
    duration,
    nodeRef,
  });

  React.useEffect(() => {
    if (layout) {
      setLastLayout(layout);
      setLastImageProps(imageProps);
    }
  }, [layout, imageProps]);

  React.useEffect(() => {
    if (state === "exited") {
      setLastLayout(null);
    }
  }, [state]);

  const effectiveLayout = layout || lastLayout;
  const {
    alt,
    src,
    style: imagePropsStyle,
    ...restImageProps
  } = imageProps || lastImageProps || {};

  const style = {
    position: "absolute",
    transition: `all ${duration}ms`,
    ...imagePropsStyle,
    ...(effectiveLayout
      ? {
          top: `${Math.round(effectiveLayout.top)}px`,
          left: `${Math.round(effectiveLayout.left)}px`,
        }
      : {}),
    ...(state === "entering" || state === "entered"
      ? {
          opacity: 1,
          transform: "scale(1)",
        }
      : {
          opacity: 0,
          transform: "scale(0)",
        }),
  };

  return (
    <img ref={nodeRef} alt={alt} src={src} style={style} {...restImageProps} />
  );
}

function GalleryPhoto({ layout, imageProps, duration }) {
  const nodeRef = React.useRef();
  return (
    <Transition nodeRef={nodeRef} in={Boolean(layout)} timeout={duration}>
      {(state) => (
        <Photo
          nodeRef={nodeRef}
          state={state}
          layout={layout}
          imageProps={imageProps}
          duration={duration}
        />
      )}
    </Transition>
  );
}

export default function Gallery({
  photos,
  allPhotos,
  spacing = 20,
  padding = 0,
  targetRowHeight = 150,
  duration = 700,
}) {
  const [model, setModel] = React.useState([]);

  const onModelChange = React.useCallback(
    (value) => {
      let offsetX = 0;
      let offsetY = 0;

      const newModel = value.map(({ layout, ...rest }, index) => {
        const top = offsetY;
        const left = offsetX;
        if (layout.photoIndex === layout.photosCount - 1 && index > 0) {
          offsetX = 0;
          offsetY += layout.height + spacing;
        } else {
          offsetX += layout.width + spacing;
        }
        return { layout: { top, left, ...layout }, ...rest };
      });

      setModel(newModel);
    },
    [spacing]
  );

  const modelMap = Object.fromEntries(
    model.map(({ photo, ...rest }) => [photo.src, { photo, ...rest }])
  );
  const containerHeight = model.reduce(
    (sum, { layout: { height, photoIndex } }, index) =>
      sum + (photoIndex === 0 ? height + (index > 0 ? spacing : 0) : 0),
    0
  );

  return (
    <>
      <div
        className="Gallery"
        style={{ height: `${Math.ceil(containerHeight)}px` }}
      >
        {allPhotos.map((photo) => {
          const { layout, imageProps } = modelMap[photo.src] || {};
          return (
            <GalleryPhoto
              key={photo.src}
              layout={layout}
              imageProps={imageProps}
              duration={duration}
            />
          );
        })}
      </div>

      <OffscreenGallery
        photos={photos}
        spacing={spacing}
        padding={padding}
        targetRowHeight={targetRowHeight}
        onModelChange={onModelChange}
      />
    </>
  );
}
