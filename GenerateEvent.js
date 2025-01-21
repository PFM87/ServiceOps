var stopwatch = new GlideStopWatch();
var types = ["Error", "Warning", "Information", "Critical", "Debug", "Notice"];
var resources = ["CPU", "Memory", "Disk Space", "Network Bandwidth", "Web Service", "Database", "Application", "Cache", "Load Balancer", "Firewall"];
var metricNames = ["CPU Usage (%)", "Memory Utilization (%)", "Disk Free Space (GB)", "Network Latency (ms)", "Response Time (ms)", "Error Rate (%)", "Throughput (requests/sec)", "Disk Read Speed (MB/s)", "Disk Write Speed (MB/s)", "Active Sessions"];
var descriptions = ["A new FAN Encryption Key was derived and activated", "A new Master FAN Key Derivation Key was Activated", "A new Master FAN Key Derivation Key was received", "Cmds: Report Hard iMODULE Reset", "Collector Battery Error: Sent when collector is not able to read its battery status", "Collector Communication Delay: Event indicating a collector is not communicating with Command Center", "Collector Communication Restored: Event indicating collector communication has been restored", "Collector Decryption Errors: Collector dropped a message due to decryption failure", "Collector Endpoint Key Derivation Key Update Failed: Encryption key update for Route A from head end to collector failed", "Collector Firmware Activation Status: Firmware is waiting for activation OR firmware is successfully activated", "Collector Firmware Awaiting Activation Date: The date that firmware is waiting for activation", "Collector Firmware Download Canceled: Download of firmware file is canceled", "Collector Firmware Download Complete: Firmware file download completed and Installation is in progress", "Collector Firmware Download Status: Collector firmware download Status"];
var ipAddresses = ["10.56.48.82", "10.23.145.67", "10.12.34.89", "10.78.90.123", "10.45.67.200", "10.99.88.76", "10.11.22.33", "10.54.32.10", "10.67.89.45", "10.22.11.99", "10.33.44.55", "10.88.77.66", "10.14.15.16", "10.21.31.41", "10.42.52.62", "10.73.83.93", "10.84.94.104", "10.15.25.35", "10.26.36.46", "10.37.47.57"];
var ciClass = 'cmdb_ci_ip_router'; // Define the CMDB class for virtual machines
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSeverity() {
    var severity = [0, 1, 2, 3, 4, 5];
    return severity[Math.floor(Math.random() * severity.length)];
}

// Function to get a random node (CI name) from a specific CMDB class
function getRandomNodeFromCIClass(ciClass) {
   var ciNames = [];
   var gr = new GlideRecord(ciClass);
   gr.addQuery('operational_status', '1'); // Optional: Filter for operational CIs
   gr.query();
   while (gr.next()) {
       ciNames.push(gr.getValue('name')); // Collect the 'name' field
   }
   if (ciNames.length === 0) {
       gs.error("No CIs found in class: " + ciClass);
       return "default_node"; // Fallback if no CIs are found
   }
   // Return a random CI name
   return ciNames[Math.floor(Math.random() * ciNames.length)];
}

function getRandomTimestamp() {
    var now = new GlideDateTime(); // Current time
    var totalHours = 12; // Look back over the last 12 hours
    var totalMilliseconds = totalHours * 60 * 60 * 1000; // Convert hours to milliseconds
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

function getRandomNode() {
    return "node" + ("00" + (Math.floor(Math.random() * 10) + 1)).slice(-3); // Format as "node001", "node002", etc.
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

for (var i = 1; i <= 1000; i++) {
   var gr = new GlideRecord('em_event');
   gr.initialize();
   gr.source = getRandomSource(); // Set random source
   gr.description = getRandomElement(descriptions); // Set random description
   gr.metric_name = getRandomElement(metricNames); // Set random metric name
   gr.severity = getRandomSeverity(); // Set random severity
   gr.node = getRandomNodeFromCIClass(ciClass); // Get node (CI name) from the specified CMDB class
   gr.time_of_event = getRandomTimestamp(); // Set time at random value
   gr.state = 'Ready';
   gr.type = getRandomElement(types); // Set random type
   gr.message_key = gr.node + "_" + getRandomResource() + "_" + getRandomElement(metricNames) + "_" + getRandomElement(types);
   gr.resource = getRandomElement(resources); // Set random resource
   gr.additional_info = "Additional details...";
   gr.resolution_state = 'New';
   gr.insert(); // Insert the record
}

//Use GlideRecord Bulk Operations
GlideRecord.insertMultiple('em_event', grlist);
gs.info("Bulk insert complete: " + stopwatch);
