output "cloudrun_name" {
  value = google_cloud_run_v2_service.parser_nlm_ingestor.name
}


output "dockerHub_image_sha256" {
  value = data.docker_registry_image.image_from_dockerHub
}

output "artifactRegistry_image_sha256" {
  value = data.google_artifact_registry_docker_image.image_from_artifactRegistry
}