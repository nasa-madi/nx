## Get the variables from the workspace yaml file and add them to the scope of the main.tf
locals {
    # Fetches the environment/workspace
    workspace_path = "./config/${terraform.workspace}.yaml" 
    defaults       = file("${path.root}/config/default.yaml")
    workspace = fileexists(local.workspace_path) ? file(local.workspace_path) : yamlencode({})
    only_in_production_mapping = {
        develop     = 0
        test        = 0
        production  = 1
    }
    settings = merge(
        yamldecode(local.defaults),
        yamldecode(local.workspace),
        {
            # Use this variable as count = local.settings.only_in_production to add features to prod only
            only_in_production = local.only_in_production_mapping[terraform.workspace]
        }
    )
}


provider "google" {
  credentials       = "credentials.json"
}

provider "google-beta" {
  credentials       = "credentials.json"
}

module "ui" {
  source = "./modules/ui"
  project_id = data.google_project.project.project_id
  docker_images = google_artifact_registry_repository.docker_images
}



module "parser" {
  source = "./modules/parser"
  project_id = data.google_project.project.project_id
  docker_images = google_artifact_registry_repository.docker_images
  settings = local.settings
  network_link = data.google_compute_network.network.self_link
  vpc_connection_link = google_vpc_access_connector.connector.self_link
  cloudrun_image_name = local.settings.parser_image_name
  cloudrun_image_tag = local.settings.parser_image_tag
  cloudrun_service_prefix = local.settings.parser_service_prefix
}

module "api" {
  source = "./modules/api"
  project_id = data.google_project.project.project_id
  docker_images = google_artifact_registry_repository.docker_images
  settings = local.settings
  network_link = data.google_compute_network.network.self_link
  vpc_connection_link = google_vpc_access_connector.connector.self_link
  path_to_configs = local.settings.path_to_configs
  parser_service_name = module.parser.parser_service_name
}



variable "services" {
  default = [
    "compute.googleapis.com", 
    "deploymentmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "iap.googleapis.com",
    "sqladmin.googleapis.com",
    "storage-api.googleapis.com"
  ]
}


resource "google_project_service" "service" {
  project       = data.google_project.project.project_id
  for_each = toset(var.services)
  service  = each.value
}
