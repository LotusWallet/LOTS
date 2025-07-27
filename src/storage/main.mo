import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
import Types "../shared/types";
import Crypto "../shared/crypto";

actor StorageCanister {
    // 存储项目映射
    private stable var storageItemsEntries : [(Text, Types.StorageItem)] = [];
    private var storageItems = HashMap.fromIter<Text, Types.StorageItem>(
        storageItemsEntries.vals(),
        storageItemsEntries.size(),
        Text.equal,
        Text.hash
    );

    // Canister所有者
    private stable var owner : Principal = Principal.fromText("aaaaa-aa");
    
    // 用户加密密钥（每个用户一个密钥）
    private stable var userKeyEntries : [(Principal, Blob)] = [];
    private var userKeys = HashMap.fromIter<Principal, Blob>(
        userKeyEntries.vals(),
        userKeyEntries.size(),
        Principal.equal,
        Principal.hash
    );

    // 系统升级时保存状态
    system func preupgrade() {
        storageItemsEntries := storageItems.entries() |> Iter.toArray(_);
        userKeyEntries := userKeys.entries() |> Iter.toArray(_);
    };

    system func postupgrade() {
        storageItemsEntries := [];
        userKeyEntries := [];
    };

    // 初始化Canister（设置所有者）
    public shared(msg) func init(canisterOwner: Principal) : async () {
        // 只允许在首次初始化时设置所有者
        if (owner == Principal.fromText("aaaaa-aa")) {
            owner := canisterOwner;
        };
    };

    // 权限检查
    private func isAuthorized(caller: Principal) : Bool {
        caller == owner
    };

    // 获取或创建用户密钥
    private func getUserKey(user: Principal) : async Blob {
        switch (userKeys.get(user)) {
            case (?key) { key };
            case null {
                let newKey = await Crypto.generateKey();
                userKeys.put(user, newKey);
                newKey
            };
        }
    };

    // 生成唯一ID
    private func generateId() : async Text {
        let g = Source.Source();
        UUID.toText(await g.new())
    };

    // 存储新项目
    public shared(msg) func storeItem(
        itemType: Types.ItemType,
        title: Text,
        data: Text,
        tags: [Text]
    ) : async Types.Result<Text, Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        try {
            let itemId = await generateId();
            let userKey = await getUserKey(caller);
            let dataBlob = Text.encodeUtf8(data);
            
            // 加密数据
            let encryptResult = await Crypto.encrypt(dataBlob, userKey);
            let encryptedData = switch (encryptResult) {
                case (#Ok(encrypted)) { encrypted };
                case (#Err(error)) { return #Err(error) };
            };
            
            let now = Time.now();
            let item : Types.StorageItem = {
                id = itemId;
                itemType = itemType;
                title = title;
                encryptedData = encryptedData;
                createdAt = now;
                updatedAt = now;
                tags = tags;
            };
            
            storageItems.put(itemId, item);
            #Ok(itemId)
        } catch (e) {
            #Err(#InternalError("存储失败"))
        }
    };

    // 获取项目（解密）
    public shared(msg) func getItem(itemId: Text) : async Types.Result<(Types.StorageItem, Text), Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        switch (storageItems.get(itemId)) {
            case (?item) {
                let userKey = await getUserKey(caller);
                let decryptResult = Crypto.decrypt(item.encryptedData, userKey);
                
                switch (decryptResult) {
                    case (#Ok(decryptedBlob)) {
                        switch (Text.decodeUtf8(decryptedBlob)) {
                            case (?decryptedText) {
                                #Ok((item, decryptedText))
                            };
                            case null {
                                #Err(#EncryptionError)
                            };
                        }
                    };
                    case (#Err(error)) {
                        #Err(error)
                    };
                }
            };
            case null {
                #Err(#NotFound)
            };
        }
    };

    // 更新项目
    public shared(msg) func updateItem(
        itemId: Text,
        title: ?Text,
        data: ?Text,
        tags: ?[Text]
    ) : async Types.Result<(), Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        switch (storageItems.get(itemId)) {
            case (?existingItem) {
                try {
                    let userKey = await getUserKey(caller);
                    var updatedItem = existingItem;
                    
                    // 更新标题
                    switch (title) {
                        case (?newTitle) {
                            updatedItem := {
                                updatedItem with
                                title = newTitle;
                                updatedAt = Time.now();
                            };
                        };
                        case null {};
                    };
                    
                    // 更新数据
                    switch (data) {
                        case (?newData) {
                            let dataBlob = Text.encodeUtf8(newData);
                            let encryptResult = await Crypto.encrypt(dataBlob, userKey);
                            let encryptedData = switch (encryptResult) {
                                case (#Ok(encrypted)) { encrypted };
                                case (#Err(error)) { return #Err(error) };
                            };
                            
                            updatedItem := {
                                updatedItem with
                                encryptedData = encryptedData;
                                updatedAt = Time.now();
                            };
                        };
                        case null {};
                    };
                    
                    // 更新标签
                    switch (tags) {
                        case (?newTags) {
                            updatedItem := {
                                updatedItem with
                                tags = newTags;
                                updatedAt = Time.now();
                            };
                        };
                        case null {};
                    };
                    
                    storageItems.put(itemId, updatedItem);
                    #Ok(())
                } catch (e) {
                    #Err(#InternalError("更新失败"))
                }
            };
            case null {
                #Err(#NotFound)
            };
        }
    };

    // 删除项目
    public shared(msg) func deleteItem(itemId: Text) : async Types.Result<(), Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        switch (storageItems.remove(itemId)) {
            case (?_) {
                #Ok(())
            };
            case null {
                #Err(#NotFound)
            };
        }
    };

    // 获取所有项目列表（不包含解密数据）
    public shared(msg) func listItems() : async Types.Result<[Types.StorageItem], Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        let items = storageItems.vals() |> Iter.toArray(_);
        #Ok(items)
    };

    // 根据类型筛选项目
    public shared(msg) func listItemsByType(itemType: Types.ItemType) : async Types.Result<[Types.StorageItem], Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        let filteredItems = storageItems.vals()
            |> Iter.filter(_, func(item: Types.StorageItem) : Bool {
                item.itemType == itemType
            })
            |> Iter.toArray(_);
        
        #Ok(filteredItems)
    };

    // 搜索项目（按标题和标签）
    public shared(msg) func searchItems(keyword: Text) : async Types.Result<[Types.StorageItem], Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        let searchResults = storageItems.vals()
            |> Iter.filter(_, func(item: Types.StorageItem) : Bool {
                Text.contains(item.title, #text keyword) or
                Array.find<Text>(item.tags, func(tag) { Text.contains(tag, #text keyword) }) != null
            })
            |> Iter.toArray(_);
        
        #Ok(searchResults)
    };

    // 获取存储统计信息
    public shared(msg) func getStorageStats() : async Types.Result<{
        itemCount: Nat;
        storageUsed: Nat;
        lastUpdated: Time.Time;
    }, Types.Error> {
        let caller = msg.caller;
        
        if (not isAuthorized(caller)) {
            return #Err(#Unauthorized);
        };

        let itemCount = storageItems.size();
        let storageUsed = storageItems.vals()
            |> Iter.map(_, func(item: Types.StorageItem) : Nat {
                item.encryptedData.data.size() + item.title.size()
            })
            |> Iter.fold(_, 0, func(acc: Nat, size: Nat) : Nat { acc + size });
        
        let lastUpdated = storageItems.vals()
            |> Iter.map(_, func(item: Types.StorageItem) : Time.Time { item.updatedAt })
            |> Iter.fold(_, 0, func(acc: Time.Time, time: Time.Time) : Time.Time {
                if (time > acc) time else acc
            });
        
        #Ok({
            itemCount = itemCount;
            storageUsed = storageUsed;
            lastUpdated = lastUpdated;
        })
    };
}