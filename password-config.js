// Password configuration with obfuscation
// WARNING: Client-side code is ALWAYS visible on GitHub Pages
// This is NOT truly secure - anyone can view source code
// For production security, use server-side authentication

(function() {
    // Double obfuscation: base64 + character array
    // This just makes it harder to find, not impossible
    const b64 = 'bW9uc3RlcmFfMjAyNSo=';
    const arr = ['m','o','n','s','t','e','r','a','_','2','0','2','5','*'];
    
    // Try base64 first, fallback to array
    try {
        window.SITE_PASSWORD = atob(b64);
    } catch(e) {
        window.SITE_PASSWORD = arr.join('');
    }
})();

