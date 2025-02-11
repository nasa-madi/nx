

variable "project_id" {
  type = string
}

variable "docker_images" {
  type = object({
    repository_id = string
    location      = string
  })
}

variable "settings"{
  type = object({
    environment = string
    env = string
    primary_region = string
    only_in_production = string
    support_email = string
    brand_title = string
    client_id = string
    client_secret = string
    db_tier = string
    db_size = string
    db_type = string
    db_backups = string
    db_highavailability = string
  })
}

variable "parser_service_name" {
  type = string
}

variable "path_to_configs" {
  type = string
  default = "../api/config/"
}

output "postgres_connection_name" {
  value = google_sql_database_instance.postgres.connection_name
}

output "cloudrun_name" {
  value = google_cloud_run_v2_service.api.name
}

variable "network_link" {
  type = string
}

variable "vpc_connection_link" {
  type = string
}