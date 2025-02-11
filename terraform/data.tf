data "google_compute_network" "network" {
  project = local.settings.network_project_id
  name    = local.settings.network_name 
}

data "google_compute_subnetwork" "subnet" {
  project = local.settings.network_project_id
  name    = "${local.settings.project_id_base}-${local.settings.env}-subnet"
  region  = local.settings.primary_region
}

data "google_projects" "project_list" {
  filter = "name:${local.settings.project_id_base}-${local.settings.env}*"
}

data "google_project" "project" {
  project_id = data.google_projects.project_list.projects[0].project_id
}

