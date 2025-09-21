import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

persistent actor {
    // Initialize the user system state
    let accessControlState = AccessControl.initState();

    // Initialize auth (first caller becomes admin, others become users)
    public shared ({ caller }) func initializeAccessControl() : async () {
        AccessControl.initialize(accessControlState, caller);
    };

    public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
        AccessControl.getUserRole(accessControlState, caller);
    };

    public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
        AccessControl.assignRole(accessControlState, caller, user, role);
    };

    public query ({ caller }) func isCallerAdmin() : async Bool {
        AccessControl.isAdmin(accessControlState, caller);
    };

    public type UserProfile = {
        name : Text;
        // Other user metadata if needed
    };

    transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    var userProfiles = principalMap.empty<UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        principalMap.get(userProfiles, caller);
    };

    public query func getUserProfile(user : Principal) : async ?UserProfile {
        principalMap.get(userProfiles, user);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        userProfiles := principalMap.put(userProfiles, caller, profile);
    };

    // Personal canister deployment tracking
    var deployedCanisters = principalMap.empty<Bool>();

    public shared ({ caller }) func deployPersonalCanister() : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("未授权：只有注册用户可以部署个人容器");
        };

        switch (principalMap.get(deployedCanisters, caller)) {
            case (?true) { Debug.trap("您已经部署了个人容器，无需重复部署"); };
            case _ {
                deployedCanisters := principalMap.put(deployedCanisters, caller, true);
            };
        };
    };

    public query ({ caller }) func hasDeployedPersonalCanister() : async Bool {
        switch (principalMap.get(deployedCanisters, caller)) {
            case (?true) { true };
            case _ { false };
        };
    };

    // Data Entry Management
    type FieldType = {
        #text;
        #password;
        #otp;
    };

    type Field = {
        name : Text;
        fieldType : FieldType;
        value : Text;
    };

    type DataEntry = {
        id : Text;
        title : Text;
        category : Text;
        createdAt : Int;
        updatedAt : Int;
        fields : [Field];
    };

    transient let textMap = OrderedMap.Make<Text>(Text.compare);
    var dataEntries = principalMap.empty<OrderedMap.Map<Text, DataEntry>>();

    public shared ({ caller }) func createDataEntry(title : Text, category : Text, fields : [Field]) : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("未授权：只有注册用户可以创建数据条目");
        };

        let id = Text.concat(title, Int.toText(Time.now()));
        let now = Time.now();

        let entry : DataEntry = {
            id;
            title;
            category;
            createdAt = now;
            updatedAt = now;
            fields;
        };

        let userEntries = switch (principalMap.get(dataEntries, caller)) {
            case null { textMap.empty<DataEntry>() };
            case (?entries) { entries };
        };

        let updatedEntries = textMap.put(userEntries, id, entry);
        dataEntries := principalMap.put(dataEntries, caller, updatedEntries);

        id;
    };

    public query ({ caller }) func getDataEntries() : async [DataEntry] {
        switch (principalMap.get(dataEntries, caller)) {
            case null { [] };
            case (?entries) { Iter.toArray(textMap.vals(entries)) };
        };
    };

    public shared ({ caller }) func updateDataEntry(id : Text, title : Text, category : Text, fields : [Field]) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("未授权：只有注册用户可以更新数据条目");
        };

        switch (principalMap.get(dataEntries, caller)) {
            case null { Debug.trap("未找到数据条目"); };
            case (?entries) {
                switch (textMap.get(entries, id)) {
                    case null { Debug.trap("未找到数据条目"); };
                    case (?entry) {
                        let updatedEntry : DataEntry = {
                            id;
                            title;
                            category;
                            createdAt = entry.createdAt;
                            updatedAt = Time.now();
                            fields;
                        };
                        let updatedEntries = textMap.put(entries, id, updatedEntry);
                        dataEntries := principalMap.put(dataEntries, caller, updatedEntries);
                    };
                };
            };
        };
    };

    public shared ({ caller }) func deleteDataEntry(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("未授权：只有注册用户可以删除数据条目");
        };

        switch (principalMap.get(dataEntries, caller)) {
            case null { Debug.trap("未找到数据条目"); };
            case (?entries) {
                let updatedEntries = textMap.delete(entries, id);
                dataEntries := principalMap.put(dataEntries, caller, updatedEntries);
            };
        };
    };
};
