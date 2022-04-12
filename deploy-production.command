cd /Users/tanerselek/Development/Projects/Productions/ElsaBilisim/Projects/Products/ElsaStoreAdmin/Development/UI.Angular
node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build --prod --aot --outputHashing=all --configuration=production

if [ -d "dist/" ] 
then

    cd dist/

    echo "zip ile sıkıştırılıyor..."
    tar -zcvf pss_publish.tar.gz *

    echo "zip transfer ediliyor..."
    sshpass -p "passw0rd" scp -r pss_publish.tar.gz root@172.16.61.223:/var/www/html/zip

    echo "publish dataları siliniyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.223 'rm -rf /var/www/html/pss/*'

    echo "zipten çıkartılıyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.223 'tar -xvf /var/www/html/zip/pss_publish.tar.gz -C /var/www/html/pss/'

    echo "aktarılan zip siliniyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.223 'rm -rf /var/www/html/zip/pss_publish.tar.gz'

    echo "servis yeniden başlatılıyor"
    sshpass -p "passw0rd" ssh root@172.16.61.223 'nginx -s reload; exit'

    echo işlem tamam

else
    echo "dist dosyası üretilemedi!"
fi
