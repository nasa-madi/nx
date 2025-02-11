
# terraform import google_cloud_run_v2_service.web_gcs_iap_proxy projects/{{project_id}}/locations/us-east4/services/gin-proxy-{{project_id}}
resource "google_cloud_run_v2_service" "web_gcs_iap_proxy" {
  name     = "gin-proxy-${var.project_id}"
  project  = var.project_id #var.project_id
  location = local.settings.primary_region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
  
  template {
    max_instance_request_concurrency = 250
    timeout                          = "300s"
    service_account                  = google_service_account.cloudrun_web_service_account.email
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    containers {
      image = "${local.settings.primary_region}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}/gin_proxy@sha256:${replace(data.docker_registry_image.gin_proxy.sha256_digest, "sha256:", "")}"
      # image = docker_image.gin_proxy.latest
      name = "gin-proxy"
      env {
        name  = "BUCKET_NAME"
        value = google_storage_bucket.web_app.name
      }
      env {
        name  = "PROXY_PORT"
        value = "3000"
      }
      ports {
        container_port = 3000
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





terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}


data "docker_registry_image" "gin_proxy" {
  name = "jamesmtc/gin_proxy:latest"
}

provider "docker" {
  host = "unix:///var/run/docker.sock"

  registry_auth {
    address  = "${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}"
  }
}

data "google_client_config" "current" {}

resource "null_resource" "run_local_script" {
  provisioner "local-exec" {
    command = <<-EOF
      docker pull ${data.docker_registry_image.gin_proxy.name};
      docker tag ${data.docker_registry_image.gin_proxy.name} ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}/gin_proxy:latest;
      docker tag ${data.docker_registry_image.gin_proxy.name} ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}/gin_proxy:${replace(data.docker_registry_image.gin_proxy.sha256_digest, "sha256:", "")};
      docker push ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}/gin_proxy:latest;
      docker push ${var.docker_images.location}-docker.pkg.dev/${var.project_id}/${var.docker_images.repository_id}/gin_proxy:${replace(data.docker_registry_image.gin_proxy.sha256_digest, "sha256:", "")};
    EOF
  }

  triggers = {
    always_run = data.docker_registry_image.gin_proxy.sha256_digest
  }
}
