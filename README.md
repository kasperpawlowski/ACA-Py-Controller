# ACA-Py-Controller

The following project is a basic implementation of Aries Cloud Agent - Python Controller (ACA-Py Controller). The controller outputs the event logs to the console and automatically accepts invitations when received. The project also provides a user interface that may be used to create, receive and accept pending invitations as well as show already established connections.

Prerequisites:
1. Python3
2. pip
3. Python3_indy
4. Indy_cli
5. libsodium

Execute the following commands to install the prerequisites:
```
sudo apt update
sudo apt install python3-pip
pip install aries-cloudagent
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88
sudo add-apt-repository "deb https://repo.sovrin.org/sdk/deb bionic master"
sudo apt update
sudo apt install -y libindy
pip3 install python3_indy
sudo apt install -y indy-cli
sudo apt install libsodium-dev
```

Use the following website to Authenticate a New DID:
https://indy-test.bosch-digital.de/

Execute the following commands to run Aries Cloud Agent - Python (ACA-Py). Remember to make appropriate changes where indicated. Note that some parameters must be the same for both of below commands:
```
aca-py provision \
--wallet-type indy \
--endpoint https://provide_your_own_public_ip_address_endpoint.com \
--seed PROVIDE_SEED_USED_ON_BOSH_WEBSITE \
--wallet-name PROVIDE_YOUR_WALLET_NAME \
--wallet-key PROVIDE_YOUR_WALLET_SECRET_KEY \
--genesis-url https://indy-test.bosch-digital.de/genesis

aca-py start \
--inbound-transport http 0.0.0.0 8000 \
--endpoint https://provide_your_own_public_ip_address_endpoint.com \
--outbound-transport http \
--admin 0.0.0.0 8001 \
--webhook-url http://localhost:8002 \
--genesis-url https://indy-test.bosch-digital.de/genesis \
--wallet-type indy \
--wallet-name PROVIDE_YOUR_WALLET_NAME \
--wallet-key PROVIDE_YOUR_WALLET_SECRET_KEY \
--seed PROVIDE_SEED_USED_ON_BOSH_WEBSITE \
--admin-insecure-mode \
--label PROVIDE_YOUR_SSI_AGENT_LABEL \
--log-level debug \
--storage-type indy \
--auto-ping-connection \
--max-message-size 10485760 
```

How to use ACA-Py Controller:
1. Clone the repository from github and change directory
```
git clone https://github.com/kasperpawlowski/ACA-Py-Controller.git
cd ACA-Py-Controller
```
2. Execute the following commands to start the Controller
```
cd controller
npm install
npm start
```
3. Execute the following commands to start user interface
```
cd frontend
npm install
npm start
```
4. Open the browser and go to http://localhost:3000