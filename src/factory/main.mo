import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "../shared/types";
import Templates "../shared/templates";

actor LotSFactory {
    // 存储用户的Canister映射
    private stable var userCanistersEntries : [(Principal, Types.CanisterInfo)] = [];
    private var userCanisters = HashMap.fromIter<Principal, Types.CanisterInfo>(
        userCanistersEntries.vals(), 
        userCanistersEntries.size(), 
        Principal.equal, 
        Principal.hash
    );

    // 系统升级时保存状态
    system func preupgrade() {
        userCanistersEntries := Iter.toArray(userCanisters.entries());
    };

    system func postupgrade() {
        userCanistersEntries := [];
    };

    // 简化版本：暂时返回模拟的Canister信息
    public shared(msg) func createStorageCanister() : async Types.Result<Types.CanisterInfo, Types.Error> {
        let caller = msg.caller;
        
        // 检查用户是否已有Canister
        switch (userCanisters.get(caller)) {
            case (?_existing) {
                return #Err(#InvalidInput("用户已拥有Storage Canister"));
            };
            case null {};
        };

        // 暂时创建一个模拟的Canister信息
        let canisterInfo : Types.CanisterInfo = {
            canisterId = caller; // 暂时使用caller作为canister ID
            owner = caller;
            createdAt = Time.now();
            storageUsed = 0;
            itemCount = 0;
        };
        
        userCanisters.put(caller, canisterInfo);
        #Ok(canisterInfo)
    };

    // 获取用户的Canister信息
    public shared(msg) func getUserCanister() : async Types.Result<Types.CanisterInfo, Types.Error> {
        let caller = msg.caller;
        
        switch (userCanisters.get(caller)) {
            case (?canisterInfo) {
                #Ok(canisterInfo)
            };
            case null {
                #Err(#NotFound)
            };
        }
    };

    // 获取所有可用的存储模板
    public query func getAvailableTemplates() : async [Types.StorageTemplate] {
        Templates.getAllTemplates()
    };

    // 根据类型获取特定模板
    public query func getTemplateByType(itemType: Types.ItemType) : async Types.Result<Types.StorageTemplate, Types.Error> {
        switch (Templates.getTemplateByType(itemType)) {
            case (?template) {
                #Ok(template)
            };
            case null {
                #Err(#NotFound)
            };
        }
    };

    // 获取系统统计信息
    public query func getSystemStats() : async {
        totalUsers: Nat;
        totalCanisters: Nat;
    } {
        {
            totalUsers = userCanisters.size();
            totalCanisters = userCanisters.size();
        }
    };
}