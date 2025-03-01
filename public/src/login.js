let password = "";

const decrypt = (ciphertext) => {
    try {
        const bytes  = CryptoJS.AES.decrypt(ciphertext, password);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const json = JSON.parse(originalText);
        return json;
    } catch (error) {
        return {};
    }
}

// - - -

while (password === null || password.length === 0) {
    password = prompt("Podaj hasło:");
}