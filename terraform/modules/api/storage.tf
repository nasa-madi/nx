
resource "google_storage_bucket" "api-bucket" {
  project  = var.project_id
  name     = "api-storage-${var.project_id}"
  location = var.settings.primary_region
}