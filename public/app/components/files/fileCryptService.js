module.exports = function (decoder, crypto, Blob) {
    var fileCryptService = {};

    fileCryptService.decoder = decoder || TextDecoder;
    fileCryptService.crypto = crypto || CryptoJS;

    fileCryptService.encrypt = function ($scope, blob, pass) {

        var data = blob;
        var decoder = new fileCryptService.decoder('utf-8');
        data = 'fllock' + decoder.decode(data);
        return fileCryptService.crypto.AES.encrypt(data, pass).toString();

    };

    fileCryptService.decrypt = function ($scope, cipher, pass) {

        var decrypted = fileCryptService.crypto.AES.decrypt(cipher.toString(),
            pass).toString(fileCryptService.crypto.enc.Hex);
        if (!decrypted.match(/^666c6c6f636b/)){
          throw new Error('Invalid password');
        }
        decrypted = decrypted.slice(12);
        var byteArray = new Uint8Array(decrypted.length/2);
        for (var i = 0; i < byteArray.length; i++){
            byteArray[i] = parseInt(decrypted.substr(i * 2, 2), 16);
        }

        return new Blob([byteArray], {type: 'application/octet-stream'});
    };

    return fileCryptService;
};