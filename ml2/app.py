from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import folium
from folium.plugins import HeatMap
import os

app = Flask(__name__)

# File paths
DATA_PATH = "Zomato_Data.csv"                # Original dataset
PROCESSED_DATA_PATH = "pune_filtered_data.csv"  # Processed data file (will be created)
MAP_FILE_PATH = "static/pune_dark_store_map.html"  # Generated map will be saved here

def process_data():
    """Load and preprocess data for Pune."""
    # Load dataset
    df = pd.read_csv(DATA_PATH)
    
    # Filter for Pune City (Delivery_person_ID starts with "PUNERES")
    df_pune = df[df["Delivery_person_ID"].str.startswith("PUNERES")].copy()
    
    # Select important features and rename 'multiple_deliveries' to 'order_freq'
    df_pune = df_pune[[
        "ID", "Delivery_person_ID", "Restaurant_latitude", "Restaurant_longitude",
        "Delivery_location_latitude", "Delivery_location_longitude",
        "Weather_conditions", "Road_traffic_density", "multiple_deliveries", "Time_taken (min)"
    ]].rename(columns={"multiple_deliveries": "order_freq"})
    
    # Fill missing values with defaults
    df_pune["Weather_conditions"].fillna("Clear", inplace=True)
    df_pune["Road_traffic_density"].fillna("Medium", inplace=True)
    df_pune["order_freq"].fillna(0, inplace=True)
    df_pune["Time_taken (min)"].fillna(df_pune["Time_taken (min)"].median(), inplace=True)
    
    # Increase order frequency by +1
    df_pune["order_freq"] += 1
    
    # Save the processed dataset (optional)
    df_pune.to_csv(PROCESSED_DATA_PATH, index=False)
    
    # Ensure 'demand_cluster' exists for further processing
    if "demand_cluster" not in df_pune.columns:
        df_pune["demand_cluster"] = 0
    
    return df_pune

def compute_new_dark_store_locations(df_pune):
    """Compute overloaded clusters and approximate new dark store locations."""
    # Group by clusters to check demand
    cluster_demand = df_pune.groupby("demand_cluster")["order_freq"].sum().reset_index()
    cluster_demand.columns = ["Cluster", "Total_Orders"]
    
    # Calculate average delivery time in each cluster
    cluster_time = df_pune.groupby("demand_cluster")["Time_taken (min)"].mean().reset_index()
    cluster_time.columns = ["Cluster", "Avg_Delivery_Time"]
    
    # Merge demand and time data
    demand_analysis = pd.merge(cluster_demand, cluster_time, on="Cluster")
    
    # Define thresholds (adjust as needed)
    max_orders_per_store = 100
    max_delivery_time = 30  # minutes
    
    # Identify clusters where demand or delivery time exceeds thresholds
    overloaded_clusters = demand_analysis[
        (demand_analysis["Total_Orders"] > max_orders_per_store) |
        (demand_analysis["Avg_Delivery_Time"] > max_delivery_time)
    ]
    
    # Compute approximate cluster centers for overloaded clusters
    new_dark_store_locations = []
    for cluster in overloaded_clusters["Cluster"]:
        cluster_points = df_pune[df_pune["demand_cluster"] == cluster][
            ["Delivery_location_latitude", "Delivery_location_longitude"]
        ]
        center = cluster_points.mean().values  # Approximate center of demand
        new_dark_store_locations.append(center)
    
    # Convert list to DataFrame
    new_dark_store_df = pd.DataFrame(new_dark_store_locations, columns=["Latitude", "Longitude"])
    new_dark_store_df["Cluster"] = overloaded_clusters["Cluster"].values
    
    return new_dark_store_df

def generate_map(df_pune, new_dark_store_df):
    """Generate a Folium map with heatmap and markers for dark stores."""
    # Existing dark stores (Restaurants used as dark stores)
    existing_dark_stores = df_pune[['Restaurant_latitude', 'Restaurant_longitude']].dropna().values.tolist()
    
    # Customer locations and order frequency (demand)
    df_pune_clean = df_pune.dropna(subset=['Delivery_location_latitude', 'Delivery_location_longitude'])
    customer_locations = df_pune_clean[['Delivery_location_latitude', 'Delivery_location_longitude']].values
    customer_weights = df_pune_clean['order_freq'].fillna(1).values
    
    # Initialize map centered on Pune
    center_lat = df_pune_clean["Delivery_location_latitude"].mean()
    center_lon = df_pune_clean["Delivery_location_longitude"].mean()
    pune_map = folium.Map(location=[center_lat, center_lon], zoom_start=12, control_scale=True)
    
    # Add customer demand heatmap
    heat_data = [[lat, lon, weight] for (lat, lon), weight in zip(customer_locations, customer_weights)]
    HeatMap(heat_data, radius=12, blur=8, max_zoom=15).add_to(pune_map)
    
    # Add markers for existing dark stores
    for loc in existing_dark_stores:
        folium.Marker(
            location=loc,
            popup="Existing Dark Store (Restaurant)",
            tooltip="Existing Dark Store",
            icon=folium.Icon(color="green", icon="home")
        ).add_to(pune_map)
    
    # Add markers for recommended new dark store locations
    for idx, loc in enumerate(new_dark_store_df[["Latitude", "Longitude"]].values):
        folium.Marker(
            location=[loc[0], loc[1]],
            popup=f"Recommended New Dark Store {idx+1}",
            tooltip=f"New Dark Store {idx+1}",
            icon=folium.Icon(color="red", icon="flag")
        ).add_to(pune_map)
    
    # Add layer control for interactivity
    folium.LayerControl().add_to(pune_map)
    
    # Ensure the static folder exists and save the map
    os.makedirs("static", exist_ok=True)
    pune_map.save(MAP_FILE_PATH)
    return MAP_FILE_PATH

@app.route('/api/darkstores', methods=['GET'])
def get_darkstores():
    """API endpoint to return recommended new dark store locations."""
    try:
        df_pune = process_data()
        new_dark_store_df = compute_new_dark_store_locations(df_pune)
        result = new_dark_store_df.to_dict(orient="records")
        return jsonify({
            "darkstores": result,
            "message": "Dark store locations computed successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/map', methods=['GET'])
def get_map():
    """Endpoint to generate and return the dark store map URL."""
    try:
        df_pune = process_data()
        new_dark_store_df = compute_new_dark_store_locations(df_pune)
        map_file = generate_map(df_pune, new_dark_store_df)
        # Return the URL path for the saved map file (adjust path as needed)
        return jsonify({"map_url": f"/{map_file}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
