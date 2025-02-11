##### Required for inbound access to VPC resources via the connector
##### See https://cloud.google.com/vpc/docs/using-firewalls#allowing_inbound_traffic_to_vpc_resources
##### See https://cloud.google.com/run/docs/configuring/shared-vpc-service-projects

resource "google_compute_firewall" "vpc_connector_requests" {
  project = data.google_project.project.project_id
  name    = "vpc-connector-requests"
  network = "${local.settings.project_id_base}-vpc"

  allow {
    protocol = "tcp"
  }

  allow {
    protocol = "udp"
  }

  allow {
    protocol = "icmp"
  }

  direction   = "INGRESS"
  source_tags = ["vpc-connector"]
}

resource "google_compute_firewall" "serverless_to_vpc_connector" {
  project = data.google_project.project.project_id
  name    = "serverless-to-vpc-connector"
  network = "${local.settings.project_id_base}-vpc"

  allow {
    protocol = "tcp"
    ports    = ["667"]
  }

  allow {
    protocol = "udp"
    ports    = ["665-666"]
  }

  allow {
    protocol = "icmp"
  }

  direction     = "INGRESS"
  source_ranges = ["35.199.224.0/19"]
  target_tags   = ["vpc-connector"]
}

resource "google_compute_firewall" "vpc_connector_to_serverless" {
  project = data.google_project.project.project_id
  name    = "vpc-connector-to-serverless"
  network = "${local.settings.project_id_base}-vpc"

  allow {
    protocol = "tcp"
    ports    = ["667"]
  }

  allow {
    protocol = "udp"
    ports    = ["665-666"]
  }

  allow {
    protocol = "icmp"
  }

  direction         = "EGRESS"
  destination_ranges = ["35.199.224.0/19"]
  target_tags       = ["vpc-connector"]
}

resource "google_compute_firewall" "vpc_connector_health_checks" {
  project = data.google_project.project.project_id
  name    = "vpc-connector-health-checks"
  network = "${local.settings.project_id_base}-vpc"

  allow {
    protocol = "tcp"
    ports    = ["667"]
  }

  direction     = "INGRESS"
  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]
  target_tags   = ["vpc-connector"]
}
