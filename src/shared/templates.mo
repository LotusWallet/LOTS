import Types "./types";
import Array "mo:base/Array";

module {
    // 预定义模板
    public let LOGIN_TEMPLATE : Types.StorageTemplate = {
        templateType = #Login;
        description = "网站和应用登录信息";
        fields = [
            { name = "网站名称"; fieldType = #Text; required = true; placeholder = ?"例如：Gmail" },
            { name = "网站URL"; fieldType = #URL; required = false; placeholder = ?"https://gmail.com" },
            { name = "用户名"; fieldType = #Text; required = true; placeholder = ?"用户名或邮箱" },
            { name = "密码"; fieldType = #Password; required = true; placeholder = null },
            { name = "备注"; fieldType = #TextArea; required = false; placeholder = ?"其他信息" }
        ];
    };

    public let CREDIT_CARD_TEMPLATE : Types.StorageTemplate = {
        templateType = #CreditCard;
        description = "信用卡和借记卡信息";
        fields = [
            { name = "卡片名称"; fieldType = #Text; required = true; placeholder = ?"例如：招商银行信用卡" },
            { name = "持卡人姓名"; fieldType = #Text; required = true; placeholder = null },
            { name = "卡号"; fieldType = #Number; required = true; placeholder = ?"16位卡号" },
            { name = "有效期"; fieldType = #Date; required = true; placeholder = ?"MM/YY" },
            { name = "CVV"; fieldType = #Number; required = true; placeholder = ?"3位安全码" },
            { name = "银行名称"; fieldType = #Text; required = false; placeholder = null },
            { name = "备注"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let BANK_ACCOUNT_TEMPLATE : Types.StorageTemplate = {
        templateType = #BankAccount;
        description = "银行账户信息";
        fields = [
            { name = "账户名称"; fieldType = #Text; required = true; placeholder = ?"例如：工资卡" },
            { name = "银行名称"; fieldType = #Text; required = true; placeholder = null },
            { name = "账户类型"; fieldType = #Text; required = false; placeholder = ?"储蓄/支票" },
            { name = "账号"; fieldType = #Number; required = true; placeholder = null },
            { name = "开户行"; fieldType = #Text; required = false; placeholder = null },
            { name = "SWIFT代码"; fieldType = #Text; required = false; placeholder = null },
            { name = "备注"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let IDENTITY_TEMPLATE : Types.StorageTemplate = {
        templateType = #Identity;
        description = "身份证件信息";
        fields = [
            { name = "证件类型"; fieldType = #Text; required = true; placeholder = ?"身份证/护照/驾照" },
            { name = "姓名"; fieldType = #Text; required = true; placeholder = null },
            { name = "证件号码"; fieldType = #Text; required = true; placeholder = null },
            { name = "签发日期"; fieldType = #Date; required = false; placeholder = null },
            { name = "有效期"; fieldType = #Date; required = false; placeholder = null },
            { name = "签发机关"; fieldType = #Text; required = false; placeholder = null },
            { name = "备注"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let CRYPTO_WALLET_TEMPLATE : Types.StorageTemplate = {
        templateType = #CryptoWallet;
        description = "加密货币钱包信息";
        fields = [
            { name = "钱包名称"; fieldType = #Text; required = true; placeholder = ?"例如：MetaMask主钱包" },
            { name = "钱包类型"; fieldType = #Text; required = true; placeholder = ?"热钱包/冷钱包" },
            { name = "助记词"; fieldType = #TextArea; required = false; placeholder = ?"12或24个单词" },
            { name = "私钥"; fieldType = #Password; required = false; placeholder = null },
            { name = "钱包地址"; fieldType = #Text; required = false; placeholder = null },
            { name = "支持币种"; fieldType = #Text; required = false; placeholder = ?"BTC, ETH, ICP" },
            { name = "备注"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let SECURE_NOTE_TEMPLATE : Types.StorageTemplate = {
        templateType = #SecureNote;
        description = "安全笔记";
        fields = [
            { name = "标题"; fieldType = #Text; required = true; placeholder = null },
            { name = "内容"; fieldType = #TextArea; required = true; placeholder = ?"安全信息内容" },
            { name = "分类"; fieldType = #Text; required = false; placeholder = ?"个人/工作/其他" }
        ];
    };

    // 获取所有预定义模板
    public func getAllTemplates() : [Types.StorageTemplate] {
        [
            LOGIN_TEMPLATE,
            CREDIT_CARD_TEMPLATE,
            BANK_ACCOUNT_TEMPLATE,
            IDENTITY_TEMPLATE,
            CRYPTO_WALLET_TEMPLATE,
            SECURE_NOTE_TEMPLATE
        ]
    };

    // 根据类型获取模板
    public func getTemplateByType(itemType: Types.ItemType) : ?Types.StorageTemplate {
        let templates = getAllTemplates();
        Array.find<Types.StorageTemplate>(templates, func(template) {
            template.templateType == itemType
        })
    };
}