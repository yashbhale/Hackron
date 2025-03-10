# City-Wide Dark Store Network Projection #

## Outcome ##

![alt text](image-1.png)


## Features ##

- Optimal dark store placement using clustering algorithms

- Geographical clustering of demand points

- Demand heatmap generation based on historical data

- Cost-based analysis (Rent, Petrol, Operational Costs)

- Expenditure report generation


## Approach ##

- Cluster the city into regions using K-Means or DBSCAN.
- Rank each cluster by:
  * Demand Weightage
  * Delivery Time
  * Traffic Congestion

- Use Multi-Criteria Decision Analysis (MCDA) to prioritize locations.
- Visualize clusters on an interactive Geospatial Map (Folium or Plotly).
Identify the best dark store locations where the cost-to-profit ratio is minimum.


## Tech Stack ##

- Frontend : NextJS
- Backend : Flask
- API : Leaflet, Google Traffic
- Models: Machine Learning Algorithm for Clustering