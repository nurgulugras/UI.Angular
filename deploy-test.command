cd /Users/tanerselek/Development/Projects/Productions/ElsaBilisim/Projects/Products/ElsaStoreAdmin/Development/UI.Angular
node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build --prod --aot --outputHashing=all --configuration=test

if [ -d "dist/" ] 
then

    cd dist/

    echo "zip ile sıkıştırılıyor..."
    tar -zcvf esa_test_publish.tar.gz *

    echo "zip transfer ediliyor..."
    sshpass -p "passw0rd" scp -r esa_test_publish.tar.gz root@172.16.61.200:/var/www/html/test/zip

    echo "publish dataları siliniyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.200 'rm -rf /var/www/html/test/esa-test/*'

    echo "zipten çıkartılıyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.200 'tar -xvf /var/www/html/test/zip/esa_test_publish.tar.gz -C /var/www/html/test/esa-test/'

    echo "aktarılan zip siliniyor..."
    sshpass -p "passw0rd" ssh root@172.16.61.200 'rm -rf /var/www/html/test/zip/esa_test_publish.tar.gz'

    echo "servis yeniden başlatılıyor"
    sshpass -p "passw0rd" ssh root@172.16.61.200 'nginx -s reload; exit'

    echo işlem tamam

else
    echo "dist dosyası üretilemedi!"
fi
