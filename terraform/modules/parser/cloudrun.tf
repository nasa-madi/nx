
# terraform import -config="." -state-out=output.json google_cloud_run_v2_service.default projects/{{project_id}}/locations/us-central1/services/cloudrun-{{project_id}}

resource "google_cloud_run_v2_service" "parser_nlm_ingestor" {
  name     = "${var.cloudrun_service_prefix}-${var.project_id}"
  project  = var.project_id
  location = var.settings.primary_region
  ingress  = "INGRESS_TRAFFIC_ALL"
  
  template {
    max_instance_request_concurrency = 250
    timeout                          = "300s"
    service_account                  = google_service_account.cloudrun_parser_nlm_service_account.email
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    
    vpc_access {
      connector = var.vpc_connection_link
      egress   = "ALL_TRAFFIC"
    }
    containers {
      image = "${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.artifactRegistry_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag}"

      # image = docker_image.nlm_ingestor.latest
      name = "${var.cloudrun_service_prefix}"
      ports {
        container_port = 5001
      }
      resources {
        cpu_idle = true
        limits = {
          cpu    = "4000m"
          memory = "4Gi"
        }
        startup_cpu_boost = true
      }
    }
    
  }

  
 
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  lifecycle {
    ignore_changes = [
      template[0].revision,
      template[0].containers[0].name,
      client,
      client_version
    ]
  }
  depends_on = [ null_resource.run_local_script ]
}

output "parser_service_name" {
    value = google_cloud_run_v2_service.parser_nlm_ingestor.name
}
  

resource "null_resource" "run_local_script" {
  provisioner "local-exec" {
    command = <<-EOF
      docker pull --platform=linux/amd64 ${var.dockerHub_folder}/${var.cloudrun_image_name}:amd64;

      docker tag ${var.dockerHub_folder}/${var.cloudrun_image_name}:amd64 ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.artifactRegistry_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag};

      docker push ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.artifactRegistry_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag};
    EOF
  }

  triggers = {
    # Forces a push anytime the sha changes on the originating image
    dockerHub_image_sha256 = data.docker_registry_image.image_from_dockerHub.sha256_digest
  }
}

output "script"{
  value = <<-EOF
      docker pull ${var.dockerHub_folder}/${var.cloudrun_image_name}:amd64;

      docker tag ${var.dockerHub_folder}/${var.cloudrun_image_name}:amd64 ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.artifactRegistry_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag};

      docker push ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.artifactRegistry_folder}/${var.cloudrun_image_name}:${var.cloudrun_image_tag};
  EOF
}
