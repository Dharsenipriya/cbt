
CAR AUCTION FABRIC - WINDOWS CMD PACKAGE
=======================================

Contents
--------
- chaincode/car-auction/      (Node.js chaincode)
  - package.json
  - index.js
- application-java/           (Java client - Maven project)
  - pom.xml
  - src/main/java/org/example/App.java
- README.txt (this file)

Goal: Example implements the tasks from your screenshots: set up Fabric test-network, deploy chaincode (asset-transfer car auction),
and use a Java SDK client to invoke and query the chaincode.

IMPORTANT PRE-REQUISITES (Windows CMD)
-------------------------------------
You must install:
  - Git (https://git-scm.com/)
  - Docker Desktop (https://www.docker.com/products/docker-desktop)
  - Node.js LTS (https://nodejs.org/) - needed for chaincode packaging and test-network scripts
  - Java JDK 11+ (Adoptium/Temurin recommended) - needed to compile/run Java client
  - Maven (https://maven.apache.org/) - to build Java client

Recommended quick installation using Chocolatey (run as Administrator in CMD):
  choco install git -y
  choco install docker-desktop -y
  choco install nodejs-lts -y
  choco install temurin11 -y
  choco install maven -y

(If you cannot install Chocolatey, download and install each package from official websites above.)

SETUP & RUN (step-by-step) - CMD
--------------------------------
1) Unzip or copy this folder into your filesystem root (for example C:\work\car-auction-fabric).
   We assume you place the folder contents INSIDE an existing fabric-samples folder structure.
   Best practice:
     C:\work\fabric-samples\test-network\   <-- you should have the test-network scripts here
     C:\work\fabric-samples\chaincode\car-auction\  <-- this chaincode folder from this package
     C:\work\fabric-samples\test-network\application\ (the test-network 'application' folder)

2) Clone fabric-samples if you haven't already:
   cd C:\work
   git clone https://github.com/hyperledger/fabric-samples.git
   cd fabric-samples\test-network

3) Copy the chaincode folder delivered with this ZIP into the fabric-samples/chaincode directory:
   copy /Y "..\..\car-auction-fabric-windows\chaincode\car-auction" "..\chaincode\"

4) Start the Fabric test network and create the channel (this will pull Docker images on first run):
   .\network.sh up createChannel -ca

5) Deploy the chaincode (this packages, installs, approves and commits using Fabric lifecycle):
   .\network.sh deployCC -ccn carauction -ccp ../chaincode/car-auction -ccl node

6) Prepare the Java client:
   - The test network normally creates organizations/.../connection-org1.json and helper scripts to add an app user.
     If you don't have a wallet/appUser identity yet, run the test-network helper to create one:
       cd ..\
       .\network.sh deployCC -ccn carauction -ccp ../chaincode/car-auction -ccl node
       REM or follow fabric-samples README to enroll an app user (addOrg1User script)

   - Copy the 'application-java' folder into fabric-samples\test-network\ (so path to connection-org1.json works):
     copy /Y "..\..\car-auction-fabric-windows\application-java" ".\"

7) Build and run the Java client (from test-network folder):
   cd application-java
   mvn package
   mvn exec:java -Dexec.mainClass=org.example.App
   OR run the JAR produced:
   java -cp target\car-auction-java-client-1.0-SNAPSHOT.jar org.example.App

Notes & troubleshooting
-----------------------
- If the Java client fails to find connection-org1.json or wallet, ensure you are running from the folder:
    fabric-samples\test-network\application-java
  and that the 'organizations' folder exists at its expected relative path.
- If you get permission or docker image errors, ensure Docker Desktop is running and you have enough resources.
- If finalizeAuction fails due to owner mismatch, createCar with the desired owner or run finalize using that owner's identity.

More learning
-------------
- Once running locally, experiment by creating two wallets/identities and running the Java client as different users.
- Add functions to chaincode (getAllCars, deleteCar) to practice query ranges and state iteration.

-- End of README

STEP 1 — Install everything (run in CMD as Administrator)
choco install -y git docker-desktop nodejs-lts temurin11 maven unzip


Then open Docker Desktop manually and let it start the Docker engine.
When Docker is running, continue below.

🧩 STEP 2 — Clone your GitHub repo (normal CMD)
cd %HOMEPATH%\Downloads
git clone https://github.com/Dharsenipriya/cbt.git


You’ll now have:

C:\Users\dhars\Downloads\cbt\
  ├─ chaincode\
  ├─ application-java\
  └─ README.txt

🧩 STEP 3 — Get Hyperledger Fabric samples (normal CMD)
cd %HOMEPATH%\Downloads
git clone https://github.com/hyperledger/fabric-samples.git


You’ll now have:

C:\Users\dhars\Downloads\fabric-samples\
  └─ test-network\

🧩 STEP 4 — Copy your code into the Fabric sample structure (normal CMD)
xcopy /E /I /Y "%HOMEPATH%\Downloads\cbt\chaincode" "%HOMEPATH%\Downloads\fabric-samples\chaincode"
xcopy /E /I /Y "%HOMEPATH%\Downloads\cbt\application-java" "%HOMEPATH%\Downloads\fabric-samples\test-network\application-java"

🧩 STEP 5 — Start the Fabric test network (run Git Bash, not CMD)

💡 Open “Git Bash” from Start Menu → right-click → Run as Administrator.

cd /c/Users/dhars/Downloads/fabric-samples/test-network
./network.sh up createChannel -ca


Wait until you see messages like
"Network up and running" and "Channel 'mychannel' created".

🧩 STEP 6 — Deploy the car-auction chaincode (Git Bash)
./network.sh deployCC -ccn carauction -ccp ../chaincode/car-auction -ccl node


If it ends with Chaincode definition committed successfully, you’re good.

🧩 STEP 7 — Create a wallet identity (Git Bash)

If the test-network provides an addOrg1User.js helper (check test-network folder):

node ./addOrg1User.js


If that file doesn’t exist, check in
organizations/peerOrganizations/org1.example.com/users/
for an existing user identity (you can later import it manually).

🧩 STEP 8 — Run the Java client (back to CMD)
cd %HOMEPATH%\Downloads\fabric-samples\test-network\application-java
mvn package
mvn exec:java -Dexec.mainClass=org.example.App


You should see console output similar to:

-> createCar CAR1
   created
-> startAuction CAR1 1000
   started
-> placeBid CAR1 1200
   bid placed
-> queryCar CAR1
   Car state: {...}
-> finalizeAuction CAR1
   Finalize result: ...

🧩 STEP 9 — Verify and shut down (Git Bash)

When you’re done experimenting:

cd /c/Users/dhars/Downloads/fabric-samples/test-network
./network.sh down


That stops and removes all Docker containers.

✅ Summary of which shell to use
Task	Shell
Installing tools	CMD (Admin)
Git clone / copy files	CMD
Running Fabric scripts (network.sh)	Git Bash
Building/running Java client	CMD
