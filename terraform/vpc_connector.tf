# terraform import google_vpc_access_connector.connector projects/$PROJECT_ID/locations/us-east4/connectors/$PROJECT_NAME-vpc-connect	

resource "google_vpc_access_connector" "connector" {
  project       = data.google_project.project.project_id
  name          = "${local.settings.project_id_base}-${local.settings.env}-vpc-connect"
  subnet {
    name        = data.google_compute_subnetwork.subnet.name
  }       
  region        = local.settings.primary_region
  min_instances = 2
  max_instances = 3
  machine_type  = "e2-micro"
}


# resource "google_project_iam_binding" "vpc_access_roles" {
#   for_each = var.cloudrun_vpc_sa_roles
#   role     = each.value
#   project = local.settings.network_project_id
#   members = [
#     "serviceAccount:service-${data.google_project.project.number}@gcp-sa-vpcaccess.iam.gserviceaccount.com",
#     "serviceAccount:${data.google_project.project.number}@cloudservices.gserviceaccount.com",
#     "serviceAccount:service-${data.google_project.project.number}@container-engine-robot.iam.gserviceaccount.com"
#   ]
# }

# # Roles that the service account will use
# variable "cloudrun_vpc_sa_roles" {
#   type = set(string)
#   default = [
#     # "roles/storage.admin",
#     # "roles/cloudsql.admin",
#     # "roles/run.admin",
#     # "roles/compute.admin",
#     "roles/vpcaccess.admin",
#     "roles/vpcaccess.serviceAgent"
#   ]
# }