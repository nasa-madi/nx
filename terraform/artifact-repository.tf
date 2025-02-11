resource "google_artifact_registry_repository" "docker_images" {
  project       = data.google_project.project.project_id
  location      = local.settings.primary_region
  repository_id = "docker-images"
  description   = "Docker repository for all project images"
  format        = "DOCKER"
}

