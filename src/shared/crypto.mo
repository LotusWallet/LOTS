import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Types "./types";

module {
    // AES-256-GCM 加密参数
    private let AES_KEY_SIZE = 32;  // 256 bits
    private let AES_NONCE_SIZE = 12; // 96 bits
    private let AES_TAG_SIZE = 16;   // 128 bits

    // 生成随机密钥
    public func generateKey() : async Blob {
        let seed = await Random.blob();
        let keyBytes = Array.tabulate<Nat8>(AES_KEY_SIZE, func(i) {
            let seedArray = Blob.toArray(seed);
            if (i < seedArray.size()) {
                seedArray[i]
            } else {
                Nat8.fromNat((i * 7 + 13) % 256)
            }
        });
        Blob.fromArray(keyBytes)
    };

    // 生成随机nonce
    public func generateNonce() : async Blob {
        let seed = await Random.blob();
        let nonceBytes = Array.tabulate<Nat8>(AES_NONCE_SIZE, func(i) {
            let seedArray = Blob.toArray(seed);
            if (i < seedArray.size()) {
                seedArray[i]
            } else {
                Nat8.fromNat((i * 11 + 17) % 256)
            }
        });
        Blob.fromArray(nonceBytes)
    };

    // AES-256-GCM 加密
    // 注意：这里是简化实现，实际项目中应使用专业的加密库
    public func encrypt(plaintext: Blob, key: Blob) : async Types.Result<Types.EncryptedData, Types.Error> {
        try {
            let nonce = await generateNonce();
            
            // 简化的加密实现（实际应使用AES-GCM）
            let plaintextArray = Blob.toArray(plaintext);
            let keyArray = Blob.toArray(key);
            let nonceArray = Blob.toArray(nonce);
            
            let encryptedArray = Array.tabulate<Nat8>(plaintextArray.size(), func(i) {
                let keyIndex = i % keyArray.size();
                let nonceIndex = i % nonceArray.size();
                plaintextArray[i] ^ keyArray[keyIndex] ^ nonceArray[nonceIndex]
            });
            
            // 生成认证标签（简化实现）
            let tagArray = Array.tabulate<Nat8>(AES_TAG_SIZE, func(i) {
                let sum = Array.foldLeft<Nat8, Nat>(encryptedArray, 0, func(acc, x) { acc + Nat8.toNat(x) });
                Nat8.fromNat((sum + i) % 256)
            });
            
            let encryptedData : Types.EncryptedData = {
                data = Blob.fromArray(encryptedArray);
                nonce = nonce;
                tag = Blob.fromArray(tagArray);
            };
            
            #Ok(encryptedData)
        } catch (e) {
            #Err(#EncryptionError)
        }
    };

    // AES-256-GCM 解密
    public func decrypt(encryptedData: Types.EncryptedData, key: Blob) : Types.Result<Blob, Types.Error> {
        try {
            let encryptedArray = Blob.toArray(encryptedData.data);
            let keyArray = Blob.toArray(key);
            let nonceArray = Blob.toArray(encryptedData.nonce);
            
            // 验证认证标签（简化实现）
            let expectedTagArray = Array.tabulate<Nat8>(AES_TAG_SIZE, func(i) {
                let sum = Array.foldLeft<Nat8, Nat>(encryptedArray, 0, func(acc, x) { acc + Nat8.toNat(x) });
                Nat8.fromNat((sum + i) % 256)
            });
            
            let actualTagArray = Blob.toArray(encryptedData.tag);
            if (not Array.equal<Nat8>(expectedTagArray, actualTagArray, Nat8.equal)) {
                return #Err(#EncryptionError);
            };
            
            // 解密数据
            let decryptedArray = Array.tabulate<Nat8>(encryptedArray.size(), func(i) {
                let keyIndex = i % keyArray.size();
                let nonceIndex = i % nonceArray.size();
                encryptedArray[i] ^ keyArray[keyIndex] ^ nonceArray[nonceIndex]
            });
            
            #Ok(Blob.fromArray(decryptedArray))
        } catch (e) {
            #Err(#EncryptionError)
        }
    };
}