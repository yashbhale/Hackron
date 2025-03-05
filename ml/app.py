from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import geopandas as gpd
import folium
from shapely.geometry import Polygon, LineString
from sklearn.cluster import KMeans
from scipy.spatial import Voronoi, ConvexHull
from sklearn.metrics import silhouette_score
from folium.plugins import HeatMap

app = Flask(__name__)

# Load Customer Data
df = pd.read_csv('Customer_data.csv')

df['order_count'] = df['order_count'].fillna(0) + 1  # Fill NaN with 0, then add 1

# Drop rows with missing location data
df = df.dropna(subset=['Delivery_location_latitude', 'Delivery_location_longitude'])



@app.route('/api/cluster', methods=['GET'])
def get_clusters():
    try:
        # Preprocess Data
        df['order_count'] = df['order_count'].fillna(0) + 1
        df.dropna(subset=['Delivery_location_latitude', 'Delivery_location_longitude'], inplace=True)

        customer_locations = df[['Delivery_location_latitude', 'Delivery_location_longitude']].values
        customer_weights = df['order_count'].values

        # Determine Optimal k
        K_range = range(2, 11)
        silhouette_scores = []
        for k in K_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
            silhouette_scores.append(silhouette_score(customer_locations, labels))

        optimal_k = K_range[np.argmax(silhouette_scores)]

        # Apply Clustering
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        df['cluster'] = kmeans.fit_predict(customer_locations, sample_weight=customer_weights)
        cluster_centers = kmeans.cluster_centers_

        return jsonify({
            "optimal_k": optimal_k,
            "cluster_centers": cluster_centers.tolist(),
            "message": "Clustering applied successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/api/map', methods=['GET'])
# def get_map():
#     try:
#         # Create Map
#         city_center = [df['Delivery_location_latitude'].mean(), df['Delivery_location_longitude'].mean()]
#         m = folium.Map(location=city_center, zoom_start=12)

#         # HeatMap
#         heat_data = [[lat, lon, weight] for (lat, lon), weight in zip(df[['Delivery_location_latitude', 'Delivery_location_longitude']].values, df['order_count'].values)]
#         HeatMap(heat_data, radius=12, blur=8, max_zoom=15).add_to(m)

#         # Cluster Boundaries with Convex Hull
#         optimal_k = df['cluster'].nunique()
#         for cluster in range(optimal_k):
#             cluster_points = df[df['cluster'] == cluster][['Delivery_location_latitude', 'Delivery_location_longitude']].values
#             if len(cluster_points) > 2:
#                 hull = ConvexHull(cluster_points)
#                 hull_points = [cluster_points[i] for i in hull.vertices] + [cluster_points[hull.vertices[0]]]
#                 hull_line = LineString(hull_points)
#                 folium.PolyLine(
#                     locations=[(p[0], p[1]) for p in hull_line.coords],
#                     color='black', dash_array='5,5', weight=2
#                 ).add_to(m)

#         # Cluster Markers
#         for cluster in df['cluster'].unique():
#             cluster_points = df[df['cluster'] == cluster][['Delivery_location_latitude', 'Delivery_location_longitude']].values
#             for loc in cluster_points:
#                 folium.Marker(location=[loc[0], loc[1]], icon=folium.Icon(color='blue')).add_to(m)

#         map_html = m._repr_html_()
#         return map_html

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
