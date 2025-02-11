## Get the variables from the workspace yaml file and add them to the scope of the main.tf
locals {
    # Fetches the environment/workspace
    workspace_path = "./config/${terraform.workspace}.yaml" 
    defaults       = file("${path.root}/config/default.yaml")
    workspace = fileexists(local.workspace_path) ? file(local.workspace_path) : yamlencode({})

    settings = merge(
        yamldecode(local.defaults),
        yamldecode(local.workspace)
    )
    
}

provider "google" {
  credentials       = "../credentials.json"
}

provider "google-beta" {
  credentials       = "../credentials.json"
}