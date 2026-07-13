<?php
// Endpoint de contacto — alvaroartiel.com
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$name = trim($_POST['name'] ?? '');
$name = str_replace(["\r", "\n"], ' ', $name);
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['website'] ?? ''); // campo oculto anti-bots
$lang = ($_POST['lang'] ?? 'es') === 'en' ? 'en' : 'es';
$topics = [
  'es' => ['producto' => 'un producto', 'web' => 'una web', 'idea' => 'una idea', 'otra' => 'otra cosa'],
  'en' => ['producto' => 'a product', 'web' => 'a website', 'idea' => 'an idea', 'otra' => 'something else'],
];
$topic = trim($_POST['topic'] ?? '');
if ($topic !== '' && isset($topics[$lang][$topic])) {
  $pre = $lang === 'en' ? 'In the works: ' : 'Tengo entre manos: ';
  $message = '[' . $pre . $topics[$lang][$topic] . '] ' . $message;
}
if ($honeypot !== '') { header('Location: ' . ($lang === 'en' ? '/en/thanks' : '/gracias')); exit; } // bot: fingir éxito
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo json_encode(['error' => 'invalid']); exit;
}
$to = 'soy@alvaroartiel.com';
$subject = '[alvaroartiel.com] Mensaje de ' . mb_substr($name, 0, 80);
$body = "Nombre: $name\nEmail: $email\n\n" . mb_substr($message, 0, 5000);
$headers = "From: web@alvaroartiel.com\r\nReply-To: $email\r\n";
mail($to, $subject, $body, $headers);
header('Location: ' . ($lang === 'en' ? '/en/thanks' : '/gracias'));
exit;
