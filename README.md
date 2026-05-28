# Ansible DevOps Setup on Server

This project provisions an Ubuntu server with Docker, installs Docker Compose,
copies the project to the server, and starts a small demo stack:
This project uses Ansible to provision an Ubuntu server, install Docker and
Docker Compose, copy this project to the server, and run a small Docker Compose
stack.

The deployed stack contains:

- Node.js API on port `3000`
- Python Flask API on port `5000`
- PostgreSQL on port `5432`
- PostgreSQL database on port `5432`

## Project Structure

  inventory.ini
  playbook.yml
  roles/
    deploy/
    docker/
    docker-compose/

docker/
  docker-compose.yml
  .env.example
  node-app/
  python-app/
```

## Local Docker Run
## Requirements

Install these on your local machine:

- Ansible
- Docker
- Docker Compose
- SSH access to your Ubuntu server

Check versions:

```bash
ansible --version
docker --version
docker compose version
```

## Configure Server Inventory

Edit `ansible/inventory.ini`:

```ini
[devops]
18.212.234.95 ansible_user=ubuntu ansible_ssh_private_key_file=/home/piku/Downloads/ansible-keyvallue.pem
```

For AWS Ubuntu EC2 servers, the SSH user is usually `ubuntu`.

Private key permissions must be secure:

```bash
chmod 400 /home/piku/Downloads/ansible-keyvallue.pem
```

Test SSH before running Ansible:

```bash
ssh -i /home/piku/Downloads/ansible-keyvallue.pem ubuntu@18.212.234.95
```

## Run Locally With Docker

From the project root:

```bash
cd docker
cp .env.example .env
docker-compose up -d --build
DOCKER_BUILDKIT=0 docker compose up -d --build
```

Check the services:
Check local services:

```bash
curl http://localhost:3000/health
curl http://localhost:5000/health
docker compose ps
```

## Server Deployment

Update `ansible/inventory.ini` with your server IP, SSH user, and private key:
Stop local services:

```ini
[devops]
your-server-ip ansible_user=ubuntu ansible_ssh_private_key_file=/path/to/key.pem
```bash
docker compose down
```

Run the playbook:
## Deploy To Server

From the project root:

```bash
cd ansible
ansible-playbook playbook.yml
```

The project is deployed to `/opt/devops-project` and started from
`/opt/devops-project/docker`.
The playbook will:

- Install Docker
- Start and enable the Docker service
- Add the deploy user to the Docker group
- Install Docker Compose at `/usr/local/bin/docker-compose`
- Copy this project to `/opt/devops-project`
- Start the Compose stack from `/opt/devops-project/docker`

## Check The Server

SSH into the server:

```bash
ssh -i /home/piku/Downloads/ansible-keyvallue.pem ubuntu@18.212.234.95
```

Check running containers:

```bash
docker ps
```

Expected containers:

```text
devops-nodejs-app
devops-python-app
devops-postgres
```

Check services from your local machine:

```bash
curl http://18.212.234.95:3000/health
curl http://18.212.234.95:5000/health
```

Expected response:

```json
{"status":"healthy"}
```

You can also open these in a browser:

```text
http://18.212.234.95:3000
http://18.212.234.95:5000
```

## Useful Server Commands

Run these after SSH login:

```bash
cd /opt/devops-project/docker
docker-compose ps
docker-compose logs -f
docker-compose restart
docker-compose down
docker-compose up -d --build
```

## AWS Security Group Ports

Allow these inbound ports in your EC2 security group:

```text
22    SSH
3000  Node.js API
5000  Python Flask API
```

Only open PostgreSQL port `5432` if you really need remote database access.
For better security, keep database access private.

## Troubleshooting

If SSH shows `UNPROTECTED PRIVATE KEY FILE`, run:

```bash
chmod 400 /home/piku/Downloads/ansible-keyvallue.pem
```

If Ansible says `Permission denied (publickey)`, check:

- The private key belongs to this EC2 instance
- The server IP is correct
- The SSH user is correct, usually `ubuntu` for Ubuntu EC2
- The key path in `ansible/inventory.ini` is correct

If the app works on the server but not from your laptop, check:

- AWS security group inbound rules
- Ubuntu firewall rules
- Running containers with `docker ps`

If local Docker build fails because `buildx` is missing, use:

```bash
DOCKER_BUILDKIT=0 docker compose up -d --build
```