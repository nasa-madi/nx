## Get the variables from the workspace yaml file and add them to the scope of the main.tf
locals {
    # Fetches the environment/workspace
    workspace_path = "../config/${terraform.workspace}.yaml" 
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


variable "project_id" {
  type = string
}

variable "docker_images" {
  type = object({
    repository_id = string
    location      = string
  })
}


output "cloudrun_name" {
  value = google_cloud_run_v2_service.web_gcs_iap_proxy.name
}