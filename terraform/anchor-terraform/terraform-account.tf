# Define the roles to be assigned to the service account
variable "service_account_roles" {
  type = set(string)
  default = [
    "roles/compute.networkAdmin",       # Compute Network Admin
    "roles/iap.tunnelResourceAccessor", # IAP-secured Tunnel User
    "roles/editor"                      # Editor
  ]
}

data "google_service_account" "terraform_service_account" {
  project      = data.google_project.project.project_id
  account_id   = "terraform-anchor-svcact"
}

# Assign the roles to the service account
resource "google_project_iam_member" "service_account_iam" {
  for_each = var.service_account_roles
  project  = data.google_project.project.project_id
  role     = each.value
  member   = "serviceAccount:${data.google_service_account.terraform_service_account.email}"
}


### STORED HERE FOR POSTERITY.  THESE PERMISSIONS WORK.
# variable "sub_project_ownership_roles" {
#   type = set(string)
#   default = [
#     "roles/artifactregistry.reader",    # Artifact Registry Reader
#     "roles/iap.web",                    # IAP-secured Web App User
#     "roles/owner",                      # Owner
#     "roles/resourcemanager.projectIamAdmin" # Project IAM Admin
#   ]
# }


# Assign ownership roles to each sub project
resource "google_project_iam_member" "sub_project_ownership" {
  for_each = zipmap([for i in range(length(local.settings.project_numbers)): i], local.settings.project_numbers)
  project  = each.value
  role     = "roles/owner"
  member   = "serviceAccount:${data.google_service_account.terraform_service_account.email}"
}
