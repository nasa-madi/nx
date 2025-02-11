resource "random_id" "postgres_suffix" {
  byte_length = 2
}

# terraform import -config="." -state-out=output.json google_sql_database_instance.postgres projects/{{proejct_id}}/instances/{{instance_id}}
resource "google_sql_database_instance" "postgres" {
  name             = "postgres-${var.project_id}-${random_id.postgres_suffix.hex}"
  region           = var.settings.primary_region
  project          = var.project_id
  database_version = "POSTGRES_14"

  settings {
    availability_type = var.settings.db_highavailability ? "REGIONAL" : "ZONAL"
    backup_configuration {
      enabled = var.settings.db_backups
    }

    tier = var.settings.db_tier
    disk_size = var.settings.db_size
    disk_type =  var.settings.db_type

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_link
    }
  }

  # deletion_protection = false
  deletion_protection = var.settings.only_in_production == "1"

  timeouts {
    create = "15m"
    delete = "30m"
  }

  # lifecycle {
  #   ignore_changes = [
  #     settings[0].replication_type,
  #   ]
  # }
}

# terraform import -config="." -state-out=output.json google_sql_database.main projects/{{proejct_id}}/instances/{{instance_id}}/databases/main
resource "google_sql_database" "main" {
  project  = var.project_id
  name     = "main"
  instance = google_sql_database_instance.postgres.name
}

# terraform import google_sql_user.db_root projects/{{project}}/instances/{{instance_id}}/users/root
resource "google_sql_user" "db_root" {
  project  = var.project_id
  count    = 1
  name     = "root"
  instance = google_sql_database_instance.postgres.name
  password = "changeme"
}
