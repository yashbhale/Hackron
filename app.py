from flask import Flask, jsonify, request, send_file, render_template_string
import pandas as pd
import numpy as np
import geopandas as gpd
import folium
import matplotlib.pyplot as plt  # Only needed if you plan to generate plots
from shapely.geometry import Polygon, LineString
from sklearn.cluster import KMeans
from scipy.spatial import Voronoi, ConvexHull
from sklearn.metrics import silhouette_score
from folium.plugins import HeatMap

app = Flask(__name__)

# Load Customer Data (global copy)
df = pd.read_csv('Customer_data.csv')
df['order_count'] = df['order_count'].fillna(0) + 1  # Fill NaN with 0, then add 1
df.dropna(subset=['Delivery_location_latitude', 'Delivery_location_longitude'], inplace=True)


@app.route('/api/cluster', methods=['GET'])
def get_clusters():
    try:
        # Preprocess Data
        df_cluster = df.copy()
        customer_locations = df_cluster[['Delivery_location_latitude', 'Delivery_location_longitude']].values
        customer_weights = df_cluster['order_count'].values

        # Determine Optimal k using silhouette score
        K_range = range(2, 11)
        silhouette_scores = []
        for k in K_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
            silhouette_scores.append(silhouette_score(customer_locations, labels))
        # optimal_k = K_range[np.argmax(silhouette_scores)]
        optimal_k=11



        # Apply Clustering
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        df_cluster['cluster'] = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
        cluster_centers = kmeans.cluster_centers_

        return jsonify({
            "optimal_k": optimal_k,
            "cluster_centers": cluster_centers.tolist(),
            "message": "Clustering applied successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/map', methods=['GET'])
def get_map():
    try:
        df_map = df.copy()

        # Extract customer locations and weights
        customer_locations = df_map[['Delivery_location_latitude', 'Delivery_location_longitude']].values
        customer_weights = df_map['order_count'].values

        # Determine optimal k using silhouette scores
        K_range = range(2, 11)
        # silhouette_scores = []
        # for k in K_range:
        #     kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        #     labels = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
        #     silhouette_scores.append(silhouette_score(customer_locations, labels))
        # optimal_k = K_range[np.argmax(silhouette_scores)]
        optimal_k=11

        # Apply KMeans clustering to compute dark store locations
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        df_map['cluster'] = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
        dark_store_locations = kmeans.cluster_centers_

        # Compute Voronoi diagram for dark store locations
        vor = Voronoi(dark_store_locations)

        def voronoi_regions(vor_obj):
            polygons = []
            for region in vor_obj.regions:
                if not region or -1 in region:
                    continue
                polygon = [vor_obj.vertices[i] for i in region]
                polygons.append(Polygon(polygon))
            return polygons

        voronoi_polygons = voronoi_regions(vor)

        # Create Folium Map centered on the city
        city_center = [df_map['Delivery_location_latitude'].mean(), df_map['Delivery_location_longitude'].mean()]
        m = folium.Map(location=city_center, zoom_start=12)

        # Add Customer Density as HeatMap
        heat_data = [
            [lat, lon, weight]
            for (lat, lon), weight in zip(customer_locations, customer_weights)
        ]
        HeatMap(heat_data, radius=12, blur=8, max_zoom=15).add_to(m)

        # Plot Voronoi Regions
        for polygon in voronoi_polygons:
            geojson = gpd.GeoSeries([polygon]).__geo_interface__
            folium.GeoJson(
                geojson,
                style_function=lambda x: {'fillColor': 'lightblue', 'color': 'blue', 'weight': 1}
            ).add_to(m)

        # Plot Dark Store Locations as Markers
        for idx, loc in enumerate(dark_store_locations):
            folium.Marker(
                location=[loc[0], loc[1]],
                popup=f"Dark Store {idx+1}",
                icon=folium.Icon(color='red', icon='home')
            ).add_to(m)

        # Draw Cluster Boundaries with Dashed Lines (using Convex Hull)
        for cluster in range(optimal_k):
            cluster_points = df_map[df_map['cluster'] == cluster][['Delivery_location_latitude', 'Delivery_location_longitude']].values
            if len(cluster_points) > 2:
                hull = ConvexHull(cluster_points)
                hull_points = [cluster_points[i] for i in hull.vertices] + [cluster_points[hull.vertices[0]]]
                hull_line = LineString(hull_points)
                folium.PolyLine(
                    locations=[(p[0], p[1]) for p in hull_line.coords],
                    color='black', dash_array='5,5', weight=2
                ).add_to(m)

        # Save the map to an HTML file
        map_path = "static/map.html"
        m.save(map_path)

        return jsonify({"map_url": "/static/map.html"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
