cd /Users/tanerselek/Development/Projects/Productions/ElsaBilisim/Projects/Products/ElsaStoreAdmin/Development/UI.Angular
node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build --prod --aot --outputHashing=all --configuration=production

if [ -d "dist/" ] 
then

    cd dist/

    echo "zip ile sıkıştırılıyor..."
    tar -zcvf pss_publish.tar.gz *

    echo "zip transfer ediliyor..."
    sshpass -p "passw0rd" scp -r pss_publish.tar.gz root@192.168.88.134:/opt/pss/web/zip

    echo "publish dataları siliniyor..."
    sshpass -p "passw0rd" ssh root@192.168.88.134 'rm -rf /opt/pss/web/ui/*'

    echo "zipten çıkartılıyor..."
    sshpass -p "passw0rd" ssh root@192.168.88.134 'tar -xvf /opt/pss/web/zip/pss_publish.tar.gz -C /opt/pss/web/ui'

    echo "aktarılan zip siliniyor..."
    sshpass -p "passw0rd" ssh root@192.168.88.134 'rm -rf /opt/pss/web/zip/pss_publish.tar.gz'

    echo "servis yeniden başlatılıyor"
    sshpass -p "passw0rd" ssh root@192.168.88.134 'nginx -s reload; exit'

    echo işlem tamam

else
    echo "dist dosyası üretilemedi!"
fi
