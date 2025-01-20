var stopwatch = new GlideStopWatch();

// Predefined arrays and constants
const types = ["Error", "Warning", "Information", "Critical", "Debug", "Notice"];
const resources = ["CPU", "Memory", "Disk Space", "Network Bandwidth", "Web Service", "Database", "Application", "Cache", "Load Balancer", "Firewall"];
const metricNames = ["CPU Usage (%)", "Memory Utilization (%)", "Disk Free Space (GB)", "Network Latency (ms)", "Response Time (ms)", "Error Rate (%)", "Throughput (requests/sec)", "Disk Read Speed (MB/s)", "Disk Write Speed (MB/s)", "Active Sessions"];
const descriptions = ["A new FAN Encryption Key was derived and activated",
    "A new Master FAN Key Derivation Key was Activated",
    "A new Master FAN Key Derivation Key was received",
    "Cmds: Report Hard iMODULE Reset",
    "Collector Battery Error: Sent when collector is not able to read its battery status",
    "Collector Communication Delay: Event indicating a collector is not communicating with Command Center",
    "Collector Communication Restored: Event indicating collector communication has been restored",
    "Collector Decryption Errors: Collector dropped a message due to decryption failure",
    "Collector Endpoint Key Derivation Key Update Failed: Encryption key update for Route A from head end to collector failed",
    "Collector Firmware Activation Status: Firmware is waiting for activation OR firmware is successfully activated",
    "Collector Firmware Awaiting Activation Date: The date that firmware is waiting for activation",
    "Collector Firmware Download Canceled: Download of firmware file is canceled",
    "Collector Firmware Download Complete: Firmware file download completed and Installation is in progress",
    "Collector Firmware Download Status: Collector firmware download Status"];
const ipAddresses = ["10.56.48.82", "10.23.145.67", "10.12.34.89", "10.78.90.123", "10.45.67.200",
    "10.99.88.76", "10.11.22.33", "10.54.32.10", "10.67.89.45", "10.22.11.99",
    "10.33.44.55", "10.88.77.66", "10.14.15.16", "10.21.31.41", "10.42.52.62",
    "10.73.83.93", "10.84.94.104", "10.15.25.35", "10.26.36.46", "10.37.47.57"];

// Function to get a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate a random severity level of 0, 1, 2, 3, 4 or 5
function getRandomSeverity() {
  const severity = [0,1,2,3,4,5];
  const RandomIndex = Math.floor(Math.random() * severity.length); // Generates a random integer between 0 and 5
  return severity[RandomIndex];
}

// Function to generate a random timestamp
function getRandomTimestamp() {
    const now = new GlideDateTime();
    now.subtract(Math.random() * 60 * 60 * 1000); // Subtract random milliseconds
    return now;
}

// Function to generate a random node value from node001 to node010
function getRandomNode() {
    return "node" + String(Math.floor(Math.random() * 10) + 1).padStart(3, '0'); // Format as "node001", "node002", etc.
}

// Function to generate a random message key
function getRandomMessageKey() {
    return [getRandomNode(), getRandomResource(), getRandomMetricName(), getRandomType()].join("_");
}

// Function to get a random resource
function getRandomResource() {
    return getRandomElement(resources);
}

// Function to get a random metric name
function getRandomMetricName() {
    return getRandomElement(metricNames);
}

// Function to get a random type
function getRandomType() {
    return getRandomElement(types);
}

// Main loop to insert records
for (var i = 1; i <= 1000; i++) {
    var gr = new GlideRecord('em_event');
    gr.initialize();
    gr.source = 'L&G Command Center';
    gr.description = getRandomElement(descriptions); // Set random description
    gr.metric_name = getRandomMetricName(); // Set random metric name
    gr.severity = getRandomSeverity(); // Set random severity
    gr.node = getRandomNode(); // Set random node
    gr.time_of_event = getRandomTimestamp(); // Set time at random value
    gr.state = 'Ready';
    gr.type = getRandomType(); // Set random type
    gr.message_key = getRandomMessageKey(); // Generate message key
    gr.resource = getRandomResource(); // Set random resource
    gr.additional_info = `
    "additional_content": "
      * Customer(s): National Grid
      * Priority: High
      * Incident Status: TEST
      * Product Type: Collector
      * Service Level: Hosted Saas
      * Impact: Multiple file checker alarms after Automic implementation.
      * Record Number: INC
      * Incident Start: CT
      * Incident Resolved: TBD
      * Duration of impact: TBD

    Summary: CT - Node collector for National Grids Command Center is down hard. The CSC is unable to ping or connect to the device IP address. Notification is being sent for field investigation."
    `;
    gr.resolution_state = 'New';
    gr.insert(); // Insert the record
}

gs.info("PAUL - forwarder " + stopwatch);
