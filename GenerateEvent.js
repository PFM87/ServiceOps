var stopwatch = new GlideStopWatch();
var totalEvents = 1000; // Number of events to generate
var lookbackHours = 12; // Spread generated events over this many hours in the past
var types = ["Error", "Warning", "Information", "Critical", "Debug", "Notice"];
var resources = ["CPU", "Memory", "Disk Space", "Network Bandwidth", "Web Service", "Database", "Application", "Cache", "Load Balancer", "Firewall"];
var metricNames = ["CPU Usage (%)", "Memory Utilization (%)", "Disk Free Space (GB)", "Network Latency (ms)", "Response Time (ms)", "Error Rate (%)", "Throughput (requests/sec)", "Disk Read Speed (MB/s)", "Disk Write Speed (MB/s)", "Active Sessions"];
var ipAddresses = ["10.56.48.82", "10.23.145.67", "10.12.34.89", "10.78.90.123", "10.45.67.200", "10.99.88.76", "10.11.22.33", "10.54.32.10", "10.67.89.45", "10.22.11.99", "10.33.44.55", "10.88.77.66", "10.14.15.16", "10.21.31.41", "10.42.52.62", "10.73.83.93", "10.84.94.104", "10.15.25.35", "10.26.36.46", "10.37.47.57"];
var ciClass = 'cmdb_ci_ip_router'; // Define the CMDB class you want to use for Node

// Severity is ordinal (0 = most severe); tie it to the chosen type instead of picking independently
var severityByType = {
    "Critical": [0, 1],
    "Error": [1, 2],
    "Warning": [2, 3],
    "Notice": [3, 4],
    "Information": [4, 5],
    "Debug": [5]
};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getSeverityForType(type) {
    var options = severityByType[type] || [0, 1, 2, 3, 4, 5];
    return getRandomElement(options);
}

// Function to fetch CI names from a specific CMDB class (query once, reuse for every event)
function getCiNamesFromClass(ciClass) {
   var ciNames = [];
   var gr = new GlideRecord(ciClass);
   gr.addQuery('operational_status', '1'); // Optional: Filter for operational CIs
   gr.query();
   while (gr.next()) {
       ciNames.push(gr.getValue('name')); // Collect the 'name' field
   }
   if (ciNames.length === 0) {
       gs.error("No CIs found in class: " + ciClass);
   }
   return ciNames;
}

// Return a random CI name from an already-fetched list, falling back to a unique placeholder if empty
function getRandomNodeFromCiNames(ciNames, fallbackIndex) {
   if (ciNames.length === 0) {
       return "default_node_" + fallbackIndex;
   }
   return ciNames[Math.floor(Math.random() * ciNames.length)];
}

function getRandomTimestamp(lookbackHours) {
    var now = new GlideDateTime(); // Current time
    var totalMilliseconds = lookbackHours * 60 * 60 * 1000; // Convert hours to milliseconds
    var clusterDurationRange = [5 * 60 * 1000, 20 * 60 * 1000]; // Cluster lasts 5-20 minutes
    var gapDurationRange = [10 * 60 * 1000, 45 * 60 * 1000]; // Gaps last 10-45 minutes
    if (!this.clusterStartTimes) {
        this.clusterStartTimes = []; // Cache cluster start times
        var timeOffset = 0;
        while (timeOffset < totalMilliseconds) {
            var clusterDuration = Math.random() * (clusterDurationRange[1] - clusterDurationRange[0]) + clusterDurationRange[0];
            this.clusterStartTimes.push({ start: timeOffset, end: timeOffset + clusterDuration });
            timeOffset += clusterDuration + Math.random() * (gapDurationRange[1] - gapDurationRange[0]) + gapDurationRange[0];
        }
    }
    var randomCluster = this.clusterStartTimes[Math.floor(Math.random() * this.clusterStartTimes.length)];
    var randomOffsetWithinCluster = Math.random() * (randomCluster.end - randomCluster.start);
    var offsetMilliseconds = randomCluster.start + randomOffsetWithinCluster;
    now.subtract(offsetMilliseconds);
    return now;
}

function getRandomResource() {
    return getRandomElement(resources); // Return a random resource
}

function getRandomSource() {
    var sources = [{ name: 'L&G Command Center', weight: 40 }, { name: 'Azure Network Monitor', weight: 25 }, { name: 'SolarWinds', weight: 20 }, { name: 'Dynatrace', weight: 10 }, { name: 'Custom Agent', weight: 5 }];
    var totalWeight = sources.reduce(function (sum, source) { return sum + source.weight; }, 0);
    var randomWeight = Math.random() * totalWeight;
    var cumulativeWeight = 0;
    for (var i = 0; i < sources.length; i++) {
        cumulativeWeight += sources[i].weight;
        if (randomWeight <= cumulativeWeight) {
            return sources[i].name;
        }
    }
    return 'Unknown'; // Fallback
}

// Build a description from the record's own resource/metric/node instead of unrelated canned text
function buildDescription(resource, metricName, node) {
    return resource + " " + metricName + " threshold breached on " + node;
}

var ciNames = getCiNamesFromClass(ciClass); // Query CIs once and reuse for every generated event

for (var i = 1; i <= totalEvents; i++) {
   var gr = new GlideRecord('em_event');
   gr.initialize();
   gr.autoSysFields(false); // Skip auto-populating sys_created_by/sys_updated_on for bulk synthetic data
   gr.setWorkflow(false); // Skip business rules/workflow processing on insert

   var node = getRandomNodeFromCiNames(ciNames, i);
   var resource = getRandomResource();
   var metricName = getRandomElement(metricNames);
   var type = getRandomElement(types);
   var sourceIp = getRandomElement(ipAddresses);

   gr.source = getRandomSource(); // Set random source
   gr.node = node;
   gr.resource = resource;
   gr.metric_name = metricName;
   gr.type = type;
   gr.severity = getSeverityForType(type); // Keep severity consistent with the chosen type
   gr.description = buildDescription(resource, metricName, node);
   gr.time_of_event = getRandomTimestamp(lookbackHours); // Set time at random value
   gr.state = 'Ready';
   gr.message_key = node + "_" + resource + "_" + metricName + "_" + type; // Reuse the record's own values so correlation/dedup works as expected
   gr.additional_info = "Source Device IP: " + sourceIp;
   gr.resolution_state = 'New';
   gr.insert(); // Insert the record

   if (i % 100 === 0) {
       gs.info("Inserted " + i + " of " + totalEvents + " events");
   }
}

gs.info("Insert complete: " + stopwatch);
