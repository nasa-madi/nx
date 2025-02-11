# Terraform Template for Google Cloud - README

##### TODOS:
Ip-Address setup
Anchor and vpc setup
state bucket setup
brand setup
credentials


## Introduction
This document provides instructions and guidelines for using the Terraform template designed to provision resources on Google Cloud Platform (GCP). Terraform is an infrastructure as code tool that allows you to define both cloud and on-premises resources in human-readable configuration files that can be versioned, reused, and shared.

## Prerequisites
Before you begin, ensure you have the following prerequisites:
- [A Google Cloud account with billing enabled](https://cloud.google.com/billing/docs/how-to/modify-project)
- [Terraform installed on your local machine](https://www.terraform.io/downloads.html)
- Access to a service account with the necessary permissions to create resources in GCP

### Setting up a backend
This repo assumes you have already backend set up in Google Cloud.  The backend for this terraform is assumed to be a GCP bucket, but can be others.  If you are just starting out, you should create the buckets manually and reference them in `backend.tf` and `anchor-terraform/backend.tf`. Jame The reason we have two states is so that core project states (like project creation and networking) can be managed separately in the `anchor-terraform` folder and backend.  Thus they are not at risk of being disrupted by application infrastructure changes or mistakes, for which states are managed in unique environments in the service backend (i.e. `backend.tf`)

### Custom Internal Certificate
This repo allows internal and external access with different URLs. Internally networked solutions likely have preset IP address, DNS naming conventions, and custom certificates.  Thus internal certificates must be stored in a bucket and referenced directly.  To set this up, you must generate a `.key.crm` file and a `.crt` file.  Here are the steps:

1. Create a storage bucket, like `acme-co-madi-keys-and-credentials`.
2. Set the `cert_storage` config variable to that bucket name.
3. Create or aquire the `.key.crm` file and the `.crt` file.
4. Upload those files to the bucket.
5. Set the `cert_prefix` config variable to the name on those files.  `cert_prefix: "madi.acme.co"` would work for `madi.acme.co.key.crm` and `madi.acme.co.crt`

Since we don't want the certificate stored in the terraform state, we must manually import the certificate resources and reference them as a data source.  Here is a command to create them for each environment as `tls-cert-self-internal-[ENV]` etc., where the environment is the `environment` var in your config

```shell
KEY="./madi.acme.co.key.pem" # CHANGE THIS
CERT="./madi.acme.co.nasa.crt" # CHANGE THIS
PROJECT="my-project-id" #CHANGE THIS
ENV="develop" # REPLACE FOR EACH ENVIRONMENT
gcloud compute ssl-certificates create "tls-cert-self-internal-${ENV}" \
--project=${PROJECT} \
--description="A self managed certificate for internal access." \
--certificate-file=${CERT} \
--private-key-file=${KEY}
```







### Authentication
To authenticate Terraform with GCP, you will need to use a service account with the appropriate permissions. A service account named `terraform-service-account` will be used across all environments: development, test, and production. This service account will be managed within the shared VPC host project, known as the "anchor" project.
> This account may have already been setup for you, so downloading credentials is the only necessary step.

**If using `terraform-anchor-svcact` and it exists already in the `anchor` environment:`**
1. Navigate to the Google Cloud Console within the anchor project.
2. Go to IAM -> Service Accounts
3. Click the three dots next to the `terraform-anchor-svcact` account.
4. Go to Keys -> Add Key
5. Click "Create new key" and "JSON" as the format.
6. Rename the file to 'credentials.json' and put in your local `terraform` folder.


**If using a personal account to run terraform`**
This is not allowed by GCP.  You must create a service account with appropriate permissions.

**If using `terraform-anchor-svcact` and it does NOT EXIST already in the `anchor` environment:`**
1. Navigate to the Google Cloud Console within the anchor project.
2. Create a new service account (if not already created) with the name `terraform-anchor-svcact`.
3. Assign roles to the service account that provide sufficient permissions for managing resources across all environments within the shared VPC. Typically, these roles may include:
   - `roles/editor` for broad access to GCP resources
   - `roles/compute.networkAdmin` for managing networking resources
   - `roles/iap.tunnelResourceAccessor` for managing the Identity Aware Proxy
   - Additional roles as required for specific GCP services
4. Generate a JSON key for the service account:
   - Go to IAM & Admin > Service Accounts.
   - Find the `terraform-anchor-svcact` and create a new key by selecting "Create Key" from the "Actions" menu.
   - Choose the JSON key type and download the key file.
5. Rename the file to 'credentials.json' and put in your local `terraform` folder.
6. Apply the `anchor-terraform` terraform code.  It should read in the account as a data source and manage permissions for other environments for you.

>WARNING: You should securely store the JSON key file and ensure that it is not checked into version control.  It is highly recommended that you remove the credentials file from your local system after you have made the required Terraform changes to avoid any security risks from a compromised machine.

**If using `terraform-anchor-svcact` in a CI/CD pipeline**
- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the JSON key file.
- Alternatively, specify the credentials in the Terraform provider configuration or backend configuration as needed



> Using the shared service account credentials is a high-risk approach to deployment.  Updating terraform and the related infrastructure should be rare and limited to authorized team members only. Any poorly planned updates to deployed infrastructure can be disasterous to a functioning application.  **USE CAUTION**. 


### Configuring the Terraform Backend
To store the Terraform state remotely and securely, you need to add a backend configuration to your Terraform files. Use the provided `core_backend.tf` template and replace the placeholders with your specific values.
```tf
# core_backend.tf
terraform {
  backend "gcs" {
    bucket = "MY-ORG-service-tf-state" # Specify your GCS bucket name 
    prefix = "MY-PROJECT-PREFIX" # Set the prefix for your state files
    credentials  = "./credentials.json" # Path to your service account key file 
  }
}
```


## Contributing and Making Changes
Terraform changes are applied manually outside the deployment pipeline. It's essential to proceed with caution when modifying infrastructure as code to prevent unintended changes or downtime.

**Steps to contribute changes:**
1. Select the appropriate Terraform workspace for the target environment (develop, test, production).
    ```shell
    terraform workspace select develop;
    ```
2. Update the Terraform configuration files with your changes.
3. Use `terraform plan` to review the planned changes and ensure they are correct.
4. Apply the changes with `terraform apply`.
5. Validate the changes in each environment sequentially: develop -> test -> production.

## API Enablement
To function correctly, ensure that the following GCP APIs are enabled in your project:
- Compute Engine
- Cloud Deployment Manager V2
- Artifact Registry
- Cloud Run
- Cloud Identity-Aware Proxy
- Cloud SQL
- Cloud Storage

**Sample gcloud command to enable these**
```sh
gcloud services enable compute.googleapis.com \
  deploymentmanager.googleapis.com \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  iap.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com --project YOUR_PROJECT_ID
```


## Managing External Images
This Terraform configuration includes resources for managing Docker images in the Artifact Registry. You need to have Docker installed and configured on your local machine.

**Ensure the following:**
- Docker is [installed](https://docs.docker.com/get-docker/) and running locally. 
- The Docker daemon is accessible at `unix:///var/run/docker.sock`.
- Refer to `/terraform/main` for the Docker image resource configuration.

## Terraform Project Structure
The Terraform template includes a set of default components that are commonly used across GCP projects. These components are defined in the Terraform files and should be reviewed and customized to fit the needs of your specific project.

### Core Infrastructure
- `core_main.tf`: Main configuration for core infrastructure components.
- `core_data.tf`: Data sources definition.
- `core_versions.tf`: Provider version constraints.
- `core_backend.tf`: Backend configuration for Terraform state.
- `core_iap.tf`: Identity-Aware Proxy settings.
- `core_artifact.tf`: Artifact management.
- `core_ip-addr.tf`: IP address management.
- `core_vpc_connector.tf`: VPC connector setup.

### API Components
- `api_cloudsql.tf`: Cloud SQL instance for API.
- `api_oauth.tf`: OAuth settings for API and the login screen.
- `api_cloudrun.tf`: Cloud Run service for API.

### UI Components
- `ui_cloudrun_proxy.tf`: Cloud Run proxy for UI.
- `ui_bucket_web.tf`: Bucket configuration for static website UI.

### Configuration and Credentials
- `config/`: Environment and configuration files. **These may need to be created based on examples provided**
    - `default.yml`: Default environment configurations.
    - `development.yml`: Development environment configurations.
    - `test.yml`: Test environment configurations.
    - `production.yml`: Production environment configurations.
- `credentials.json`: Service account and authentication credentials.


## Security Notice
Always handle service account keys and sensitive data with care. Ensure that you do not commit secrets to version control and that you follow best practices for managing credentials and access control in your organization.

For more information on Terraform and GCP, refer to the official documentation:
- [Terraform Documentation](https://www.terraform.io/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)





## Setting up the Terraform at the beginning of your project
First, decide on a shortname for your service.  This will be used in a lot of files and config so keep it concise, with only lowercase letters, numbers, dashes, and underscores.  For example a service for SFTP might simply be `sftp` or `sftp-api`.

You then need to add that name to FOUR files (or confirm it has been done):
```markdown
`/terraform/config/default.yaml` --> `project_id_base` : `YOUR_PROJECT_SHORTNAME`
`/terraform/core_backend.tf`     --> `prefix` = `YOUR_PROJECT_SHORTNAME`
```


## Setting up the Environments:
In case this hasn't been done you should first run `terraform init` inside the `/terraform` folder.  

Once the service has been inited, you should ensure that all of the workspaces/environments have been setup in the remote state.  Run the following:

```
terraform workspace new develop;
terraform workspace new test;
terraform workspace new production;
```

With that, you now have placeholder workspaces for all the environments.

To get into the develop workspace:
```
terraform workspace select develop;
```

*Environment Variables*
For your terraform environment variables (not application env), there are individual files prepared for you:
```
/terraform/
└── config
   ├── default.yaml
   ├── develop.yaml
   ├── production.yaml
   ├── test.yaml
   └── staging.yaml
```
The default.yaml file has configuration that is universal to all the environments.  The other files have specific variables necessary to get your stuff up and running.

## What's not included in this Project
The VPCs is not included here.

# DATABASE SECURITY
CloudSQL terraform requires a default password.  Make sure to swap out the password for the `postgres` user once the assets are created.  This password can be injected in the build process eventually and then not exposed inside the terraform file. It is set to `changeme` as the default





 ____INCOMPLETE______
## Troubleshooting
This section provides guidance on resolving common problems you may encounter when using the Terraform templates.

- **Issue**: Terraform fails to authenticate with Google Cloud.
  **Solution**: Verify that you have set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable correctly, and that the service account JSON key file has the necessary permissions.

- **Issue**: Terraform plan or apply fails with an error about missing permissions.
  **Solution**: Ensure that the service account has the required roles and permissions for the resources you are trying to manage.

- **Issue**: Terraform state is out of sync with the actual cloud resources.
  **Solution**: Use `terraform refresh` to update the state file with real-time data from Google Cloud. If the issue persists, you may need to inspect the state file manually and correct any discrepancies.

## License
This Terraform template is made available under the [MIT License](https://opensource.org/licenses/MIT). You may use, distribute, and modify this code under the terms of the license.

## Support and Contributions
For support with this Terraform template, please open an issue in the project's GitHub repository. Contributions to this project are welcome; please submit a pull request with your proposed changes.

## Changelog
The changelog is maintained in the `CHANGELOG.md` file within the repository. It contains a curated, chronologically ordered list of notable changes for each version of the project.

## Known Issues
- Service account key rotation is not automated and must be done manually.
- IP address ranges for the VPC connectors may need adjustment based on the existing network setup.

## Best Practices
- Regularly rotate your service account keys and audit IAM roles.
- Use Terraform workspaces to manage multiple environments.
- Keep your Terraform version up to date to leverage the latest features and fixes.

## Disaster Recovery
Always have a backup of your Terraform state file in a secure location. Define and implement a disaster recovery plan that includes how to restore your infrastructure from the Terraform configurations in case of a catastrophic failure.

## Deprecation Notices
Information regarding deprecated features or practices will be communicated through the project's GitHub repository and included in the release notes.

## FAQ
- **Q**: Can I use this template to manage existing GCP resources?
  **A**: Yes, but you will need to import the existing resources into Terraform's state before you can manage them with Terraform.

- **Q**: How do I upgrade to a newer version of a Terraform provider?
  **A**: Update the version in the `core_versions.tf` file and run `terraform init` to download the new version.