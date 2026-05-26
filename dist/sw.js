// 완전히 서비스워커 제거 (가장 강력한 죽이기 코드)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
  // 자기 자신을 unregister
  await self.registration.unregister();

  // 모든 클라이언트에게 페이지 새로고침 강제
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.navigate(client.url));
});
