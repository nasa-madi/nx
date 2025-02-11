# Service Account for running the proxy
#--------------------------------------------------------------------
resource "google_service_account" "cloudrun_web_service_account" {
  project      = var.project_id
  account_id   = "cloudrun-runner-web-proxy"
  display_name = "CloudRun's Web Service Account"
}

# Roles that the service account will use
variable "cloudrun_web_sa_roles" {
  type = set(string)
  default = [
    "roles/storage.objectViewer"
  ]
}

# creates and adds roles to the terraform SA
resource "google_project_iam_member" "cloudrun_web_tf_sa" {
  for_each = var.cloudrun_web_sa_roles
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.cloudrun_web_service_account.email}"
}