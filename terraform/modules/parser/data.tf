
data "google_artifact_registry_docker_image" "image_from_artifactRegistry" {
  project       = var.project_id
  location      = var.settings.primary_region
  repository_id = var.artifactRegistry_folder
  image_name    = "${var.cloudrun_image_name}:${var.cloudrun_image_tag}"
  depends_on    = [ 
    null_resource.run_local_script
  ]
}


data "docker_registry_image" "image_from_dockerHub" {
  name = "${var.dockerHub_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag}"
  provider = docker.default
}