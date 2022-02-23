
import CryptoJS from '../crypto.js'

// var k = '437JtMiXdQwxyVoG'
// var i = 'jskey_1611024283'
// var str = '437JtMiXdQwxyVoG4lkDf9LLm9ZDehTbjn2r88yUpZlYlIzPdrWu5HC+3F4aiqnop5nRyDEorO/CwuJrGVEYGkIt/RLcgbr/3m/J7ISmetYrwSERn2SiUMOdUHZSDVqV+CuiTclPWysWAgzS0xTBvct9nCa9ZR43MPwyuXNBUr4mu3y3bz8jR02H3YgArxbjzDaT/er9dSfd5hiC9mPQw7D72VQLV64MQdvXcWBOa+spsnKE868mu7z1ATzHKMBTG89/Rnczou3Az29GwYjn71+RPNH+umm5jwTo9YrysyRsRT/3hyPK5U7Ix4Hun3e0GJVwKZTH6eT6dDVv0Qz656A0/2vFTFlRZtDVS5XSiKPNGyez9QQd3V509p6JEny7Que1Xcp4nRoXXIAgKZkoEbYwDEl663v5C+vRsIM1C30uC59ayklc/nthwWen4u9ktqljeN0Z22AX5ppx1C3BdqB8tXxttiJIP3OsFFYamFfmW7GsYGDO/HcOgOXcNPEz3kyb5sPLHZKmNoha9P/mE7TfQq4b+sQ2muaaT04+amGF5jwnNMjv6O5Joq92vaA3dzovdAJiMhNYxNofx+Im8Tmog+SajVCR25mjNJHWfwhh7S6mQ9pLb4asasgU9tbpcDAJ0qoZKO697Af2arAZag=='

/**
 * 加密
 */
// function encrypt(str) {
//     key = CryptoJS.enc.Utf8.parse(KEY);// 秘钥
//     var iv= CryptoJS.enc.Utf8.parse(IV);//向量iv
//     var encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
//     return encrypted.toString();
// }
export const encrypt = (str) => {
    key = CryptoJS.enc.Utf8.parse(KEY);// 秘钥
    var iv= CryptoJS.enc.Utf8.parse(IV);//向量iv
    var encrypted = CryptoJS.AES.encrypt(str, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}
/**
 * 解密
 * @param str
 */
// function decrypt(k,i,str) {
//     var key = CryptoJS.enc.Utf8.parse(k);// 秘钥
// 	console.log(key)
//     var iv=    CryptoJS.enc.Utf8.parse(i);//向量iv
// 	console.log(iv)
//     var decrypted = CryptoJS.AES.decrypt(str,key,{iv:iv,padding:CryptoJS.pad.Pkcs7});
// 	console.log(decrypted)
// 	console.log(decrypted.toString(CryptoJS.enc.Utf8))
//     return decrypted.toString(CryptoJS.enc.Utf8);
	
// }

// console.log(decrypt(k,i,str))


export const decrypt = (k,i,str) => {
      var key = CryptoJS.enc.Utf8.parse(k);// 秘钥
      var iv =    CryptoJS.enc.Utf8.parse(i);//向量iv
      var decrypted = CryptoJS.AES.decrypt(str,key,{iv:iv,padding:CryptoJS.pad.Pkcs7});
      return decrypted.toString(CryptoJS.enc.Utf8);
}

