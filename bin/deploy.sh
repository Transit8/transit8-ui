#!/bin/bash -e
#
# Deploy the bidlogix application.
#
############################################################

SERVER=$1
DEPLOY_SERVER=$SERVER:/home/bob/deployment/brightblockjs

printf "\nSyncing brightblockjs to $DEPLOY_SERVER\n\n"

rsync -aP --quiet -e "ssh -p 7019" dist/ bob@$DEPLOY_SERVER

ssh -i ~/.ssh/id_rsa -p 7019 bob@$SERVER "
	rsync -aP --quiet  /home/bob/deployment/brightblockjs/  rsync://localhost:10873/volume/deployments/nginx/html/brightblockjs
";

printf "\nFinished brightblockjs nginx build and deployment.\n\n"
