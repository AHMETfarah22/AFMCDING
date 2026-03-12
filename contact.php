<?php
// PHP hatalarını görmek isterseniz açabilirsiniz, canlida kapalı kalsın
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Composer kullandığımız için autoload.php'yi dahil ediyoruz:
require 'vendor/autoload.php'; 

// Eğer PHPMailer'ı klasör olarak indirdiyseniz aşağıdaki satırları kullanın:
// require 'PHPMailer/src/Exception.php';
// require 'PHPMailer/src/PHPMailer.php';
// require 'PHPMailer/src/SMTP.php';

// JSON formatında veri döndüreceğimizi belirtiyoruz
header('Content-Type: application/json');

// JavaScript'ten gelen JSON verisini alıyoruz
$data = json_decode(file_get_contents("php://input"));

if(empty($data->name) || empty($data->email) || empty($data->subject) || empty($data->message)) {
    echo json_encode(["success" => false, "error" => "Lütfen tüm alanları doldurun."]);
    exit;
}

// Güvenlik için htmlspecialchars kullanıyoruz
$name = htmlspecialchars($data->name);
$email = htmlspecialchars($data->email);
$subject = htmlspecialchars($data->subject);
$message = nl2br(htmlspecialchars($data->message));

$mail = new PHPMailer(true);

try {
    // Sunucu ayarları
    // $mail->SMTPDebug = 2; // Hata ayıklama modunu açmak isterseniz yorumu kardırın (canlıda 0 kalmalıdır)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';  // Gmail SMTP sunucusu
    $mail->SMTPAuth   = true;
    
    // ====== BURAYI DEĞİŞTİRİN ======
    $mail->Username   = 'dedeyare4455@gmail.com'; // Kendi Gmail adresiniz
    $mail->Password   = 'tcfumjuepbhoysrc'; // Gmail'den aldığınız 16 haneli App Password (Uygulama Şifresi)
    // ===============================
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587; // STARTTLS için port

    // Alıcı ve Gönderici
    // Sitenizden mesaj size geleceği için hem gönderen hem alıcı sizin adresiniz olabilir.
    // Ancak müşteriye geri dönmek (Reply) için müşterinin adresini Reply-To yapıyoruz.
    $mail->setFrom('dedeyare4455@gmail.com', 'AFM-CODING Web Sitesi');
    $mail->addAddress('dedeyare4455@gmail.com');     // Mesaj size gelecek
    $mail->addReplyTo($email, $name);                // Yanıtla dediğinizde müşteriye gidecek

    // İçerik (E-posta Tasarımı)
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Sitenizden Yeni Mesaj: ' . $subject;
    $mail->Body    = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2>Web sitenizden yeni bir iletişim formu mesajı aldınız! 🚀</h2>
            <hr style='border: 1px solid #e2e8f0; margin-bottom: 20px;'>
            <p><strong>Kimden:</strong> {$name}</p>
            <p><strong>E-posta adresi:</strong> {$email}</p>
            <p><strong>Konu:</strong> {$subject}</p>
            <br>
            <p><strong>Mesaj Detayı:</strong></p>
            <div style='background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;'>
                {$message}
            </div>
            <br>
            <p style='font-size: 12px; color: #94a3b8;'>Bu e-posta AFM-CODING iletişim formu üzerinden otomatik olarak gönderilmiştir.</p>
        </div>
    ";
    
    // HTML desteklemeyen mail istemcileri için düz metin
    $mail->AltBody = "Sitenizden yeni mesaj!\nGönderen: {$name}\nE-posta: {$email}\nKonu: {$subject}\n\nMesaj:\n{$data->message}";

    $mail->send();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Mesaj gönderilemedi. Sunucu Hatası: {$mail->ErrorInfo}"]);
}
