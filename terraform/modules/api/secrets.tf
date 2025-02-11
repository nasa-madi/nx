# Define the Google Secret Manager Secret
resource "google_secret_manager_secret" "env-overrides" {
  secret_id = "${var.settings.environment}-env-overrides"
  project   = var.project_id

  labels = {
    secrettype = var.settings.environment
  }

  replication {
    auto {}
  }
}

# Update the secret only if the config file exists and its hash has changed
resource "null_resource" "update_secret" {
  triggers = {
    config_yml = fileexists("${var.path_to_configs}${var.settings.environment}.yml") ? sha256(file("${var.path_to_configs}${var.settings.environment}.yml")) : "file_not_found"
  }

  provisioner "local-exec" {
    command = <<EOF
      CONFIG_FILE="${var.path_to_configs}${var.settings.environment}.yml"
      if [ -f "$CONFIG_FILE" ]; then
        cat "$CONFIG_FILE" | gcloud secrets versions add ${var.settings.environment}-env-overrides --project=${var.project_id} --data-file=-
        last_version=$(gcloud secrets versions list ${var.settings.environment}-env-overrides --project=${var.project_id} --format='get(name)' | grep -v DISABLED | head -n 2 | tail -n 1)
        gcloud secrets versions disable $last_version --project=${var.project_id}
      else
        echo "API Configuration file $CONFIG_FILE does not exist or path is incorrect. Skipping secret update."
      fi
    EOF
  }

  depends_on = [google_secret_manager_secret.env-overrides]
}