# Bucket to store website
resource "google_storage_bucket" "web_app" {
  project       = var.project_id
  name          = "web-app-${var.project_id}-${random_id.app.hex}"
  location      = local.settings.primary_region
  timeouts {}
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  versioning {
    enabled = true
  }
}

resource "random_id" "app" {
  byte_length = 4
}
