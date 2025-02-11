data "google_compute_global_address" "api_static_ip_address" {
  name          = "api-lb-static-ip-addr-${data.google_project.project.project_id}"
  project       = data.google_project.project.project_id
}

data "google_compute_global_address" "web_static_ip_address" {
  name          = "web-lb-static-ip-addr-${data.google_project.project.project_id}"
  project       = data.google_project.project.project_id
}



/***************************
* The following is used to create the ip address referenced above, but
* to make sure that DNS doesn't need to get routed to a new IP, the ip
* is removed from terraform and then converted to a data source above.
* The command to add only these
* $ terraform apply -target=google_compute_global_address.api_static_ip_address
* $ terraform apply -target=google_compute_global_address.web_static_ip_address
* The command to remove is:
* $ terraform state rm 'google_compute_global_address.api_static_ip_address'
* $ terraform state rm 'google_compute_global_address.web_static_ip_address'
*************************/

# resource "google_compute_global_address" "api_static_ip_address" {
#   name          = "api-lb-static-ip-addr-${data.google_project.project.project_id}"
#   project       = data.google_project.project.project_id
#   address_type  = "EXTERNAL"
#   ip_version    = "IPV4"
# }

# resource "google_compute_global_address" "web_static_ip_address" {
#   name          = "web-lb-static-ip-addr-${data.google_project.project.project_id}"
#   project       = data.google_project.project.project_id
#   address_type  = "EXTERNAL"
#   ip_version    = "IPV4"
# }