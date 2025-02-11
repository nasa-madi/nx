
# Service Account for running the Cloudrun Revision
#--------------------------------------------------------------------
#  terraform import -config="." -state-out=output.json google_service_account.cloudrun_service_account projects/{{project_id}}/serviceAccounts/cloudrun-runner-api@{{project_id}}.iam.gserviceaccount.com
resource "google_service_account" "cloudrun_api_service_account" {
  project      = var.project_id
  account_id   = "cloudrun-runner-api"
  display_name = "CloudRun's API Service Account"
}

# Roles that the service account will use
variable "cloudrun_api_sa_roles" {
  type = set(string)
    default = [
    "roles/storage.objectAdmin",        # Read and write access to Google Cloud Storage
    "roles/cloudsql.client",            # Access to Cloud SQL
    "roles/run.invoker",                # Invoke Cloud Run services
    "roles/vpcaccess.user",             # Use VPC connectors
    "roles/serverless.serviceAgent",    # Manage serverless resources
    "roles/secretmanager.secretAccessor"
  ]


    #   default = [
    #     "roles/storage.admin",
    #     "roles/cloudsql.admin",
    #     "roles/run.admin",
    #     "roles/vpcaccess.user",
    #     # "roles/compute.viewer",
    #     "roles/compute.admin",
    #     "roles/run.serviceAgent",
    #     "roles/serverless.serviceAgent"
    #     # "roles/iam.serviceAccountUser",
    #     # "roles/redis.admin",
    #     # "roles/resourcemanager.projectIamAdmin",
    #     # "roles/servicenetworking.networksAdmin",
    #   ]
}

# creates and adds roles to the terraform SA
resource "google_project_iam_member" "cloudrun_tf_sa" {
  for_each = var.cloudrun_api_sa_roles
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.cloudrun_api_service_account.email}"
}

# adds a invoker role to the service account but only for the parser service
resource "google_cloud_run_service_iam_member" "invoker" {
  project        = var.project_id
  service        = var.parser_service_name
  location       = var.settings.primary_region
  role           = "roles/run.invoker"
  member         = "serviceAccount:${google_service_account.cloudrun_api_service_account.email}"
}