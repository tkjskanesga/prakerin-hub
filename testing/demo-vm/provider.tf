terraform {
  required_providers {
    proxmox = {
      source  = "telmate/proxmox"
      version = "2.9.14"
    }
  }
}

provider "proxmox" {
  pm_api_url      = "https://192.168.41.2:8006/api2/json" # URL Proxmox!
  pm_api_token_id = "root@pam!token_nama" # Username!
  pm_api_token_secret = "your-secret-key" # Password!
  pm_tls_insecure = true
}