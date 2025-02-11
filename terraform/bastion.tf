


data "google_compute_image" "vm_image" {
  family  = "centos-stream-9"
  project = "centos-cloud"
}


resource "google_project_iam_member" "bastion" {
  for_each = toset(["roles/editor", "roles/cloudsql.client"])
  project = data.google_project.project.project_id
  role     = each.value
  member   = "serviceAccount:${module.bastion.service_account}"
  depends_on = [module.bastion]
}


module "bastion" {
  source = "terraform-google-modules/bastion-host/google"
  project = data.google_project.project.project_id
  zone    = "${local.settings.primary_region}-a"
  network = data.google_compute_network.network.self_link
  host_project = local.settings.network_project_id
  subnet  = data.google_compute_subnetwork.subnet.self_link
  # image = data.google_compute_image.vm_image.self_link
  image = "projects/centos-cloud/global/images/centos-stream-9-v20240515"
  name =  "${local.settings.project_id_base}-${local.settings.env}-bastion"
  
  # only needed in one environment.  now forgotten
  create_firewall_rule = false

  # manually created before usage.  Should auto teardown after 60min.
  create_instance_from_template = true

  startup_script = <<EOT
    #!/bin/bash
    yum -y update
    URL="https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.6.1"
    curl "$URL/cloud-sql-proxy.linux.amd64" -o cloud-sql-proxy
    chmod +x cloud-sql-proxy
    ./cloud-sql-proxy --private-ip --port 3307 ${module.api.postgres_connection_name} &

    # Schedule a shutdown command to run at midnight every day
    echo "0 0 * * * /sbin/shutdown -h now" | crontab -
  EOT
}




output "bastion_commands" {
  value = <<EOF

  --------------- Bastion Connect Command ---------------

  Create Command:
  gcloud compute instances create ${local.settings.project_id_base}-${local.settings.env}-bastion --zone "${local.settings.primary_region}-a" --source-instance-template=${module.bastion.instance_template}

  Start Bastion: 

  gcloud compute instances start ${local.settings.project_id_base}-${local.settings.env}-bastion --zone "${local.settings.primary_region}-a" --project "${data.google_project.project.project_id}"

      Connect Cloud SQL Proxy:
      ./cloud-sql-proxy --private-ip --port 3307 ${module.api.postgres_connection_name}


  SSH Command:
  gcloud compute ssh --zone "${local.settings.primary_region}-a" "${local.settings.project_id_base}-${local.settings.env}-bastion" --tunnel-through-iap --project "${data.google_project.project.project_id}"


  SSH Tunnel Command:
  gcloud compute ssh --zone "${local.settings.primary_region}-a" "${local.settings.project_id_base}-${local.settings.env}-bastion" --tunnel-through-iap --project "${data.google_project.project.project_id}" -- -N -L 3306:localhost:3307

  --------------------------------------------------------

  EOF
}