const MapViewer = () => {
    return (
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          src="https://hackron-production.up.railway.app/static/map.html"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    );
  };
  
  export default MapViewer;
  