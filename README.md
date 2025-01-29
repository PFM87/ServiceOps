This script generates 1,000 random events (records) in the em_event table of ServiceNow. 
It assigns random values to each event, like the source of the event, severity level, description, resource affected, and the node (device or system) that triggered the event.
It pulls node names from the CMDB (Configuration Management Database), caches them to avoid repeated queries, and uses that list to assign nodes to events. 
Each event also gets a random timestamp from the past 12 hours. 
Once all the events are created, they are inserted into the database in bulk for better performance. 
