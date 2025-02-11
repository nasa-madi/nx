# Service Account for running the Cloudrun Revision
#--------------------------------------------------------------------
resource "google_service_account" "cloudrun_parser_nlm_service_account" {
  project      = var.project_id
  account_id   = "cloudrun-parser"
  display_name = "Parser - NLM Ingestor - Service Account"
}

# Roles that the service account will use
variable "cloudrun_parser_nlm_sa_roles" {
  type = set(string)
  default = [
    "roles/storage.objectViewer"
  ]
}

# creates and adds roles to the terraform SA
resource "google_project_iam_member" "cloudrun_parser_nlm_tf_sa" {
  for_each = var.cloudrun_parser_nlm_sa_roles
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.cloudrun_parser_nlm_service_account.email}"
}