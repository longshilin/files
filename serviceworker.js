const cacheName = 'files';
let isPasswordCorrect = false; // Flag to check if the password is correct

addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  if (request.method !== 'GET') {
    return;
  }

  fetchEvent.respondWith(async function () {
    if (!isPasswordCorrect) {
      // Check the password before allowing access
      const password = prompt('Enter the password:');
      if (password === 'longsl123') {
        isPasswordCorrect = true;
      } else {
        return new Response('Access denied. Incorrect password.', { status: 403 });
      }
    }

    const fetchPromise = fetch(request);
    fetchEvent.waitUntil(async function () {
      const responseFromFetch = await fetchPromise;
      const responseCopy = responseFromFetch.clone();
      const myCache = await caches.open(cacheName);
      return myCache.put(request, responseCopy);
    }());

    if (request.headers.get('Accept').includes('text/html')) {
      try {
        return fetchPromise;
      } catch (error) {
        return caches.match(request);
      }
    } else {
      const responseFromCache = await caches.match(request);
      return responseFromCache || fetchPromise;
    }
  })();
});
