resource "proxmox_vm_qemu" "prakerin_vm" {
  name        = "prakerinhub-vm"
  target_node = "pve"
  vmid        = 200
  
  clone = "ubuntu-22-04-template"

  cores   = 2
  sockets = 1
  memory  = 2048
  
  disk {
    size            = "32G"
    type            = "scsi"
    storage         = "local-lvm"
  }

  network {
    model  = "virtio"
    bridge = "vmbr0"
    tag    = 30
  }

  ipconfig0 = "ip=192.168.41.50/24,gw=192.168.41.1"

  os_type = "cloud-init"
  
  cicustom = "user=local:snippets/cloud-init.yaml"
}