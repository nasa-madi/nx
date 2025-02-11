
# terraform import -config="." -state-out=output.json google_cloud_run_v2_service.default projects/{{project_id}}/locations/us-central1/services/cloudrun-{{project_id}}
# terraform import -config="." -state-out=output.json google_sql_database_instance.postgres projects/{{project_id}}/instances/{{instance_id}}
resource "google_cloud_run_v2_service" "api" {
  name     = "api-${var.project_id}"
  project  = var.project_id
  location = var.settings.primary_region
  ingress  = "INGRESS_TRAFFIC_ALL"


  template {
    max_instance_request_concurrency = 250
    timeout                          = "300s"
    service_account                  = google_service_account.cloudrun_api_service_account.email
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"
    vpc_access {
      connector = var.vpc_connection_link
      egress   = "PRIVATE_RANGES_ONLY"
    }
    volumes {
      name = "${var.settings.environment}-env-overrides-volume"
      secret {
        secret = google_secret_manager_secret.env-overrides.secret_id
        items {
          path    = "develop.yml"
          version = "latest"
        }
      }
    }
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.postgres.connection_name]
      }
    }

    containers {
      image = "gcr.io/cloudrun/hello"
      // Use the secret to copy the config file to the app's config directory, to avoid over-mounting the whole config directory
      command = [ "sh", "-c", "cp /secret/${var.settings.environment}.yml /app/config/local-${var.settings.environment}.yml && npm start" ]

      volume_mounts {
        name       = "${var.settings.environment}-env-overrides-volume"
        mount_path = "/secret"
      }
      
      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  lifecycle {
    ignore_changes = [
      template[0].containers[0].name,
      template[0].containers[0].image,
      template[0].containers[0].env,
      template[0].labels,
      client,
      client_version
    ]
  }
  depends_on = [ google_cloud_run_service_iam_member.invoker ]
}






