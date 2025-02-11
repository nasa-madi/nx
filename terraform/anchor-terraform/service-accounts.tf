/*** VPC Access by SubProjects ***/
variable "cloudrun_vpc_sa_roles" {
  type = set(string)
  default = [
    # "roles/vpcaccess.admin",
    "roles/vpcaccess.serviceAgent",
    "roles/compute.networkUser"
  ]
}


# See: https://cloud.google.com/iam/docs/understanding-roles#run.serviceAgent
# See: https://cloud.google.com/compute/docs/access/service-accounts#google_apis_service_agent
# See: https://cloud.google.com/vpc/docs/configure-serverless-vpc-access#service_account_permissions
resource "google_project_iam_binding" "vpc_access_roles" {
  for_each = toset(var.cloudrun_vpc_sa_roles)
  project  = data.google_project.project.project_id
  role     = each.value
  members  = flatten([
    for project_number in local.settings.project_numbers : [
      "serviceAccount:service-${project_number}@gcp-sa-vpcaccess.iam.gserviceaccount.com", # Serverless VPC Access Service Agent
      "serviceAccount:${project_number}@cloudservices.gserviceaccount.com", # Google APIs Service Agent 

      # "serviceAccount:service-${project_number}@container-engine-robot.iam.gserviceaccount.com" # GKE
      # "serviceAccount:service-${project_number}@cloudsql.iam.gserviceaccount.com" # Cloud SQL
      # "serviceAccount:service-${project_number}@gae-api-prod.google.com.iam.gserviceaccount.com" # App Engine
      # "serviceAccount:service-${project_number}@serverless-robot-prod.iam.gserviceaccount.com" # Cloud Run
    ]
  ])
}