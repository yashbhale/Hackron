const MapViewer1 = () => {
    return (
      <div style={{ width: "100%", height: "600px" }}>
        <iframe
          src="http://127.0.0.1:5000/static/pune_dark_store_map.html"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    );
  };
  
  export default MapViewer1;
  
