Event Generation Script

This repository contains a script designed to generate and insert random event records into the em_event table in ServiceNow. The script simulates various types of events with different severities, resources, and metrics, providing a comprehensive dataset for testing and development purposes.

Features

Random Event Generation: Generates events with random sources, descriptions, metric names, severities, nodes, timestamps, and resources.

Customizable CI Class: Allows specifying a CMDB class to fetch random nodes (CI names) from.

Clustered Timestamps: Generates event timestamps within clusters to simulate real-world event patterns.

Bulk Insert: Utilizes GlideRecord bulk operations for efficient insertion of multiple records.

Script Details
The script includes the following key components:

Random Data Generation: Functions to generate random elements from predefined arrays for sources, descriptions, metric names, severities, nodes, and resources.

Clustered Timestamp Generation: Function to generate random timestamps within specified clusters to mimic real-world event patterns.

CI Class Integration: Function to fetch random nodes (CI names) from a specified CMDB class.

Event Insertion: Loop to create and insert 1000 event records into the em_event table.
