

variable "project_id" {
  type = string
}

variable "docker_images" {
  type = object({
    repository_id = string
    location      = string
  })
}

variable "cloudrun_image_name" {
  type = string
  default = "madi-parser-nlm"
}

variable "dockerHub_folder" {
  type = string
  default = "nasamadi"
}

variable "cloudrun_service_prefix"{
  type = string
  default = "parser-nlm-ingestor"
}

variable "artifactRegistry_folder"{
  type = string
  default = "docker-images"
}

variable "cloudrun_image_tag" {
  type = string
  default = "latest"
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

variable "network_link" {
  type = string
}

variable "vpc_connection_link" {
  type = string
}



