#!/bin/bash



# Move randomsql to module.api
terraform state mv random_id.app                                        module.ui.random_id.app
terraform state mv google_storage_bucket.web_app                        module.ui.google_storage_bucket.web_app
terraform state mv google_cloud_run_v2_service.web_gcs_iap_proxy        module.ui.google_cloud_run_v2_service.web_gcs_iap_proxy 
terraform state mv 'google_project_iam_member.cloudrun_web_tf_sa["roles/storage.objectViewer"]' 'module.ui.google_project_iam_member.cloudrun_web_tf_sa["roles/storage.objectViewer"]'
terraform state mv google_service_account.cloudrun_web_service_account module.ui.google_service_account.cloudrun_web_service_account
terraform state mv null_resource.run_local_script                    module.ui.null_resource.run_local_script

terraform state mv null_resource.update_secret                          module.api.null_resource.update_secret
terraform state mv random_id.postgres_suffix                            module.api.random_id.postgres_suffix 
terraform state mv google_sql_user.db_root                              module.api.google_sql_user.db_root
terraform state mv google_storage_bucket.api-bucket                     module.api.google_storage_bucket.api-bucket
terraform state mv google_secret_manager_secret.env-overrides           module.api.google_secret_manager_secret.env-overrides
terraform state mv google_sql_database_instance.postgres                module.api.google_sql_database_instance.postgres
terraform state mv google_sql_database.main                             module.api.google_sql_database.main
terraform state mv google_cloud_run_v2_service.api                      module.api.google_cloud_run_v2_service.api
terraform state mv google_service_account.cloudrun_api_service_account  module.api.google_service_account.cloudrun_api_service_account
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/storage.admin"]'            'module.api.google_project_iam_member.cloudrun_tf_sa["roles/storage.admin"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/cloudsql.admin"]'           'module.api.google_project_iam_member.cloudrun_tf_sa["roles/cloudsql.admin"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/run.admin"]'                'module.api.google_project_iam_member.cloudrun_tf_sa["roles/run.admin"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/vpcaccess.user"]'           'module.api.google_project_iam_member.cloudrun_tf_sa["roles/vpcaccess.user"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/compute.admin"]'            'module.api.google_project_iam_member.cloudrun_tf_sa["roles/compute.admin"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/run.serviceAgent"]'         'module.api.google_project_iam_member.cloudrun_tf_sa["roles/run.serviceAgent"]'
terraform state mv 'google_project_iam_member.cloudrun_tf_sa["roles/serverless.serviceAgent"]'  'module.api.google_project_iam_member.cloudrun_tf_sa["roles/serverless.serviceAgent"]'





# PROJECT_ID=<your-project-id>
# INSTANCE_NUM=<your-instance-number>


# # Remove original assets from the state
# terraform state rm google_sql_user.db_root
# terraform state rm google_sql_database_instance.postgres
# terraform state rm google_sql_database.main
# terraform state rm google_storage_bucket.api-bucket
# terraform state rm google_cloud_run_v2_service.api
# terraform state rm google_service_account.cloudrun_api_service_account
# terraform state rm google_secret_manager_secret.env-overrides
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/storage.admin"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/cloudsql.admin"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/run.admin"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/vpcaccess.user"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/compute.admin"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/run.serviceAgent"]'
# terraform state rm 'google_project_iam_member.cloudrun_tf_sa["roles/serverless.serviceAgent"]'


# # Import assets into the module.api instance
# terraform import module.api.random_id.postgres_suffix random_id.postgres_suffix
# terraform import module.api.google_sql_user.db_root projects/$PROJECT_ID/instances/postgres-$PROJECT_ID-$INSTANCE_NUM/users/root
# terraform import module.api.google_storage_bucket.api-bucket api-storage-$PROJECT_ID
# terraform import module.api.google_secret_manager_secret.env-overrides projects/$PROJECT_ID/secrets/develop-env-overrides
# terraform import module.api.google_sql_database_instance.postgres projects/$PROJECT_ID/instances/postgres-$PROJECT_ID-$INSTANCE_NUM
# terraform import module.api.google_sql_database.main projects/$PROJECT_ID/instances/postgres-$PROJECT_ID-$INSTANCE_NUM/databases/main
# terraform import module.api.google_cloud_run_v2_service.api projects/$PROJECT_ID/locations/us-east4/services/api-$PROJECT_ID
# terraform import module.api.google_service_account.cloudrun_api_service_account projects/$PROJECT_ID/serviceAccounts/cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/storage.admin"]' "$PROJECT_ID roles/storage.admin serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/cloudsql.admin"]' "$PROJECT_ID roles/cloudsql.admin serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/run.admin"]' "$PROJECT_ID roles/run.admin serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/vpcaccess.user"]' "$PROJECT_ID roles/vpcaccess.user serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/compute.admin"]' "$PROJECT_ID roles/compute.admin serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/run.serviceAgent"]' "$PROJECT_ID roles/run.serviceAgent serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"
# terraform import -config="." -state-out=output.json 'module.api.google_project_iam_member.cloudrun_tf_sa["roles/serverless.serviceAgent"]' "$PROJECT_ID roles/serverless.serviceAgent serviceAccount:cloudrun-runner-api@$PROJECT_ID.iam.gserviceaccount.com"