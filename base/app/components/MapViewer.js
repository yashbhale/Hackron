const MapViewer = () => {
    return (
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          src="http://192.168.0.100:5000/static/map.html"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    );
  };
  
  export default MapViewer;
  