
/*************************************************
 * SPECIAL RESOURCES
 * The brand  can only be created once for an org and cannot be patched, so just
 * make sure that this matches the console.  The client cannot be created for an
 * external facing application from the api. Info for the client should be manually
 * entered in the config. Data objects are also not supported for these elements.  
 *************************************************/

# terraform import google_iap_brand.project_brand projects/123456789/brands/123456789
resource "google_iap_brand" "project_brand" { 
  support_email     = local.settings.support_email
  application_title = local.settings.only_in_production == 1 ? local.settings.brand_title : "(${local.settings.env}) ${local.settings.brand_title}"
  project           = data.google_project.project.number
}


# before commenting the client_secret back in, make sure to add the secret to the settings file.
resource "terraform_data" "iap_client" {
  input = {
    client_id     = local.settings.client_id
    client_secret = local.settings.client_secret
  }
  lifecycle {
    ignore_changes = [
      input.client_secret,
      output.client_secret
    ]
  }
}