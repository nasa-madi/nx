/**************************/
resource "google_compute_region_network_endpoint_group" "svrlss_neg_api" {
  name                  = "svrlss-neg-api-${data.google_project.project.project_id}"
  network_endpoint_type = "SERVERLESS"
  project               = data.google_project.project.project_id
  region                = local.settings.primary_region
  provider              = google
  cloud_run {
    service = module.api.cloudrun_name
  }
}

resource "google_compute_region_network_endpoint_group" "svrlss_neg_web" {
  name                  = "svrlss-neg-web-${data.google_project.project.project_id}"
  network_endpoint_type = "SERVERLESS"
  project               = data.google_project.project.project_id
  region                = local.settings.primary_region
  provider              = google
  cloud_run {
    service = module.ui.cloudrun_name
  }

}

/**************************/
resource "google_compute_health_check" "default" {
  project            = data.google_project.project.project_id
  name               = "load-balancer-health-check"
  timeout_sec        = 1
  check_interval_sec = 10
  http_health_check {
    port = 80
  }
}



module "lb-http" {
  source  = "GoogleCloudPlatform/lb-http/google//modules/serverless_negs"
  project = data.google_project.project.project_id
  name    = "serverless-neg-${data.google_project.project.project_id}"

  ssl                    = true
  https_redirect         = false
  create_ssl_certificate = false
  ssl_certificates       = [
    google_compute_managed_ssl_certificate.external.self_link,
    data.google_compute_ssl_certificate.internal.self_link
  ]
  address                = data.google_compute_global_address.api_static_ip_address.address
  create_address         = false # we're going to use an address stored outside of this module

  create_url_map = false
  url_map        = google_compute_url_map.default.name

  backends = {

    api = {

      description = null
      groups = [
        {
          group = google_compute_region_network_endpoint_group.svrlss_neg_api.id
        }
      ]
      enable_cdn             = false
      security_policy        = null
      custom_request_headers = null
      iap_config = {
        enable               = true
        oauth2_client_id     = terraform_data.iap_client.output.client_id
        oauth2_client_secret = terraform_data.iap_client.output.client_secret
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    web = {
      description = null
      groups = [
        {
          group = google_compute_region_network_endpoint_group.svrlss_neg_web.id
        }
      ]
      enable_cdn             = false
      security_policy        = null
      custom_request_headers = null
      iap_config = {
        enable               = true
        oauth2_client_id     = terraform_data.iap_client.output.client_id
        oauth2_client_secret = terraform_data.iap_client.output.client_secret
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
  }
  depends_on = [ 
    google_compute_managed_ssl_certificate.external
   ]
}



# terraform import google_compute_url_map.default projects/{{project_id}}/global/urlMaps/serverless-neg-{{project_id}}-url-map
resource "google_compute_url_map" "default" {
  default_service = module.lb-http.backend_services.web.self_link
  name            = "serverless-neg-${data.google_project.project.project_id}-url-map"
  project         = data.google_project.project.project_id

  host_rule {
    hosts        = local.settings.urls
    path_matcher = "path-matcher-external"
  }
  host_rule {
    hosts        = local.settings.internalUrls
    path_matcher = "path-matcher-internal"
  }

  timeouts {}

  path_matcher {
    default_service = module.lb-http.backend_services.web.self_link
    name            = "path-matcher-external"

    path_rule {
      paths = [
        "/api",
        "/api/*",
      ]
      service = module.lb-http.backend_services.api.self_link
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }
  }
   
  path_matcher {
    default_service = module.lb-http.backend_services.web.self_link
    name            = "path-matcher-internal"

    path_rule {
      paths = [
        "/api",
        "/api/*",
      ]
      service = module.lb-http.backend_services.api.self_link
      route_action {
        url_rewrite {
          path_prefix_rewrite = "/"
        }
      }
    }
  }


  test {
    host    = local.settings.urls[0]
    path    = "/api"
    service = module.lb-http.backend_services.api.self_link
  }

  test {
    path    = "/"
    host    = local.settings.urls[0]
    service = module.lb-http.backend_services.web.self_link
  }

  test {
    host    = local.settings.internalUrls[0]
    path    = "/api"
    service = module.lb-http.backend_services.api.self_link
  }

  test {
    path    = "/"
    host    = local.settings.internalUrls[0]
    service = module.lb-http.backend_services.web.self_link
  }
}





/***********************************
#         IAP Permissions          #
************************************/
# creates and adds roles to the terraform SA
resource "google_project_iam_member" "cloudrun_tf_iap" {
  project = data.google_project.project.project_id
  role    = "roles/run.invoker"
  member  = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-iap.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "member_domain" {
  project = data.google_project.project.project_id
  role    = "roles/iap.httpsResourceAccessor"
  member  = "domain:${local.settings.member_domain}"
}







/***********************************
#         CERTIFICATES             #
************************************/

######### EXTERNAL NETWORK CERTS #############
# terraform import google_compute_managed_ssl_certificate.default projects/{{project_id}}/global/sslCertificates/tls-cert-{{project_id}}

resource "google_compute_managed_ssl_certificate" "external" {
  name    = "tls-cert-external-${data.google_project.project.project_id}"
  project = data.google_project.project.project_id
  type    = "MANAGED"
  managed {
    domains = local.settings.urls
  }
  lifecycle {
    create_before_destroy = true
  }
}

######### INTERNAL NETWORK CERTS #############

data "google_compute_ssl_certificate" "internal" {
  project = data.google_project.project.project_id
  name = "tls-cert-self-internal-${local.settings.environment}"
}