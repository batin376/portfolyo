# Kemal Batın Kayabaşı — Portfolyo

Uzay temalı, animasyonlu ve tam ekran kaydırmalı kişisel portfolyo. Derleme veya paket kurulumu gerekmez.

## Açılış
VS Code'da `index.html` üzerinde sağ tık → **Open with Live Server** veya **Go Live**.
Alternatif: `python -m http.server 5500` çalıştırıp `http://localhost:5500` adresini aç.

## Dosyalar
- `index.html`: bölüm yapısı ve gezinme.
- `styles.css`: renkler, düzen, mobil görünüm ve video kenar maskesi.
- `script.js`: bölüm geçişleri, galeri ve büyütme.
- `black-hole.js`: karadelik videosunun görünürlük ve hareket tercihlerine göre oynatılması.
- `content.js`: hakkımda metni, proje notları ve fotoğraf açıklamaları.
- `assets/`: site görselleri, yerel karadelik videosu ve poster.

## Kullanım
Kaydırma, bölüm bağlantıları veya yön / Page Up / Page Down tuşları ile gezin. Mobilde uzun bölümler normal kaydırılır. Galeri fotoğraflarını düğmelerle veya yatay dokunma hareketiyle değiştir. Büyütülmüş fotoğrafı Escape ile kapat; sağ ve sol okla değiştir.

Sol alttaki kontrol animasyonları duraklatır. Sistemindeki hareket azaltma tercihi de uygulanır. Karadelik videosu görünümden çıktığında veya sekme arka plana geçtiğinde durur.

## Karadelik hareketi
`karadelik hareketi/ab11b8cf0450bc67532b771e22d3ec48_720w.mp4` örneği `assets/black-hole-motion.mp4` olarak projeye alındı. Önceki WebGL çizimi yerine, örnekteki eğimli parlak disk ve hareketli mavi gaz bulutları doğrudan bu yerel videodan gösterilir. Bu sürüm fizik simülasyonu yapmaz.

Video sessiz ve mobilde satır içinde oynar. `assets/black-hole-ping-pong.mp4`, kaynak videoyu 1,5 kat yavaşlatılmış hızla önce ileri, sonra aynı hızla geri oynatan 30,125 saniyelik döngüdür. Hız ve ters hareket dosyaya işlenmiştir; tarayıcı tek videoyu yerel `loop` özelliğiyle oynatır. Yön değişimlerinde uç kareler fazladan tekrarlanmaz. Kaynak video korunur; `.qa/build-ping-pong.py` döngü dosyasını yeniden üretir (OpenCV ve imageio-ffmpeg gerektirir). Duraklatma, görünürlük ve hareket azaltma tercihleri uygulanır. Karadeliğin yanındaki tarih ve saat Türkiye saatine göre saniyede bir güncellenir. Yatay kadraj ve eliptik yumuşak maske videonun kenarlarını uzay arka planına yedirir. `assets/black-hole-poster.jpg` ilk kareyi gösterir. Eski karadelik görselleri assets klasöründe tutulmuştur.

Google Fonts erişilemezse yerel yazı tipleri kullanılır. Görseller, video ve temel işlevler yereldir.

