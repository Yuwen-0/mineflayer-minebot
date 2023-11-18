# Minecraft Madencilik Botu

Bu depo, oyun içinde madencilik görevlerini otomatikleştirmek için Mineflayer kullanılarak JavaScript'te programlanmış bir Minecraft botunu içerir.

## Kurulum

### Önkoşullar
- Git kurulu olmalı ([Git'i İndir](https://git-scm.com/downloads))
- Node.js kurulu olmalı ([Node.js'i İndir](https://nodejs.org/))
- Minecraft Java Sürümü kurulu olmalı

### Kurulum

1. Depoyu klonlayın:

    ```bash
    git clone https://github.com/your-username/minecraft-mining-bot.git
    ```

2. Proje dizinine gidin:

    ```bash
    cd minecraft-mining-bot
    ```

3. Bağımlılıkları yükleyin:

    ```bash
    npm install
    ```

4. `settings.json` dosyasını güncelleyin:

    - `settings.json` dosyasını açın ve gerekli sunucu IP, port, bot kullanıcı adı ve diğer yapılandırma detaylarını doldurun.

### Kullanım

1. Bot'u başlatın:

    ```bash
    npm start
    ```

2. Minecraft'ta, sunucunun çalıştığından emin olun ve botu madencilik yapmak istediğiniz yere götürün.

3. Bot'u etkinleştirmek için Minecraft sohbetinde şu komutu kullanın:

    ```
    startMining <başlangıçNoktası:x> <başlangıçNoktası:y> <başlangıçNoktası:z> <madenBloklarıSıra> <madenBloklarıSütun>
    ```

    `<başlangıçNoktası:x>`, `<başlangıçNoktası:y>`, `<başlangıçNoktası:z>`, `<madenBloklarıSıra>`, ve `<madenBloklarıSütun>`'u madencilik için istediğiniz başlangıç koordinatları ve boyutlarla değiştirin.

## Özellikler

- Çeşitli cevherlerin otomatik madenciliği
- Madencilik sırasında aydınlatma için meşale yerleştirme
- Envanter yönetimi (eşyaları bırakma, sandıklarda depolama)
- Lava, su ve çakıl gibi engellerle başa çıkma

## Yapılandırma

- Bot kimlik bilgilerini, sunucu detaylarını ve davranış ayarlarını ayarlamak için `settings.json` dosyasını değiştirin.

## Bağımlılıklar

- `mineflayer`: Minecraft botları oluşturmak için JavaScript kütüphanesi
- `mineflayer-pathfinder`: Mineflayer botları için yol bulma eklentisi
- `prismarine-viewer`: Botun etkinliklerini bir tarayıcıda görselleştirmek için kullanılan görüntüleyici

## Katkıda Bulunma

Bu projeye sorunlar veya çekme istekleri göndererek katkıda bulunabilirsiniz.

## Lisans

Bu proje [GNU Lisansı](LICENSE) altında lisanslanmıştır.
