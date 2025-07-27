import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import IC "mo:ic";
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
        userCanistersEntries := userCanisters.entries() |> Iter.toArray(_);
    };

    system func postupgrade() {
        userCanistersEntries := [];
    };

    // 创建用户专属Storage Canister
    public shared(msg) func createStorageCanister() : async Types.Result<Types.CanisterInfo, Types.Error> {
        let caller = msg.caller;
        
        // 检查用户是否已有Canister
        switch (userCanisters.get(caller)) {
            case (?existing) {
                return #Err(#InvalidInput("用户已拥有Storage Canister"));
            };
            case null {};
        };

        try {
            // 创建新的Storage Canister
            let ic : IC.Service = actor("aaaaa-aa");
            let settings = {
                controllers = ?[caller, Principal.fromActor(LotSFactory)];
                compute_allocation = null;
                memory_allocation = null;
                freezing_threshold = null;
            };
            
            let createResult = await ic.create_canister({
                settings = ?settings;
            });
            
            let canisterId = createResult.canister_id;
            
            // 安装Storage Canister代码
            // 注意：这里需要预先编译好的Storage Canister WASM代码
            // 实际部署时需要替换为真实的WASM模块
            let wasmModule = "\00asm\01\00\00\00"; // 占位符
            
            await ic.install_code({
                mode = #install;
                canister_id = canisterId;
                wasm_module = wasmModule;
                arg = Principal.toBlob(caller); // 传递owner信息
            });
            
            // 记录Canister信息
            let canisterInfo : Types.CanisterInfo = {
                canisterId = canisterId;
                owner = caller;
                createdAt = Time.now();
                storageUsed = 0;
                itemCount = 0;
            };
            
            userCanisters.put(caller, canisterInfo);
            
            #Ok(canisterInfo)
        } catch (e) {
            #Err(#InternalError("创建Canister失败"))
        }
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