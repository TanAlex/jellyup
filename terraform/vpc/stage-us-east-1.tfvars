namespace = "onica-stage"
customer = "onica"
environment = "stage"
aws_region = "us-east-1"
account_id = "102345678900"


prod_account_id = "12345678900"
stage_account_id = "102345678900"
shared_account_id = "120345678900"
audit_account_id = "123045678900"
log-archive_account_id = "123405678900"
master_account_id = "123450678900"

tags = {
    "CustomerName" = "Onica Inc.",
    "ApplicationName"= "terraform",
    "EnvironmentName"= "stage",
    "CostCenter" = "0",
    "TechOwner" = "onica",
    "TechOwnerEmail" = "tech_support@onica.com"
}

#--------------------
# VPC
#--------------------
az_count = 3
root_disk = {
  volume_size           = "350"
  volume_type           = "gp2"
  delete_on_termination = false
}

