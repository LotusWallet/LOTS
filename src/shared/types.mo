import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
    // 存储项目类型枚举
    public type ItemType = {
        #Login;           // 登录信息
        #CreditCard;      // 信用卡信息
        #BankAccount;     // 银行账户
        #Identity;        // 身份信息
        #CryptoWallet;    // 加密钱包
        #SecureNote;      // 安全笔记
        #Custom: Text;    // 自定义类型
    };

    // 加密数据结构
    public type EncryptedData = {
        data: Blob;           // 加密后的数据
        nonce: Blob;          // 加密随机数
        tag: Blob;            // 认证标签
    };

    // 存储项目
    public type StorageItem = {
        id: Text;                    // 唯一标识符
        itemType: ItemType;          // 项目类型
        title: Text;                 // 标题
        encryptedData: EncryptedData; // 加密数据
        createdAt: Time.Time;        // 创建时间
        updatedAt: Time.Time;        // 更新时间
        tags: [Text];                // 标签
    };

    // 存储模板
    public type StorageTemplate = {
        templateType: ItemType;
        fields: [TemplateField];
        description: Text;
    };

    // 模板字段
    public type TemplateField = {
        name: Text;
        fieldType: FieldType;
        required: Bool;
        placeholder: ?Text;
    };

    // 字段类型
    public type FieldType = {
        #Text;
        #Password;
        #Email;
        #URL;
        #Number;
        #Date;
        #TextArea;
    };

    // API响应类型
    public type Result<T, E> = {
        #Ok: T;
        #Err: E;
    };

    // 错误类型
    public type Error = {
        #NotFound;
        #Unauthorized;
        #InvalidInput: Text;
        #EncryptionError;
        #StorageFull;
        #InternalError: Text;
    };

    // Canister信息
    public type CanisterInfo = {
        canisterId: Principal;
        owner: Principal;
        createdAt: Time.Time;
        storageUsed: Nat;
        itemCount: Nat;
    };
}